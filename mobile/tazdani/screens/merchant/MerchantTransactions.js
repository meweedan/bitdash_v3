// src/components/merchant/TransactionsList.js
import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import ThemedText from '../../components/ThemedText.js';
import { Card } from '../../components/SharedComponents';

const TransactionItem = ({ transaction, onPress }) => {
  const { attributes } = transaction;
  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit': return '#48BB78';
      case 'withdrawal': return '#E53E3E';
      case 'transfer': return '#3182CE';
      case 'payment': return '#805AD5';
      default: return '#718096';
    }
  };

  const color = getTransactionColor(attributes.type);

  return (
    <TouchableOpacity onPress={() => onPress(transaction)}>
      <Card style={styles.transactionItem}>
        <View style={styles.transactionIcon}>
          <Icon
            name={attributes.type === 'deposit' ? 'arrow-down-left' : 'arrow-up-right'}
            size={24}
            color={color}
          />
        </View>

        <View style={styles.transactionDetails}>
          <View style={styles.transactionHeader}>
            <ThemedText style={styles.merchantName}>
              {attributes.merchant?.data?.attributes?.metadata?.businessName || 'Transaction'}
            </ThemedText>
            <ThemedText style={[styles.amount, { color }]}>
              {attributes.type === 'deposit' ? '+' : '-'} {attributes.amount.toLocaleString()} {attributes.currency}
            </ThemedText>
          </View>

          <View style={styles.transactionFooter}>
            <View style={[styles.badge, { backgroundColor: color + '20' }]}>
              <ThemedText style={[styles.badgeText, { color }]}>
                {attributes.type}
              </ThemedText>
            </View>
            <ThemedText style={styles.date}>
              {format(parseISO(attributes.createdAt), 'MMM d, h:mm a')}
            </ThemedText>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const TransactionsList = ({ merchantId }) => {
  const [filters, setFilters] = useState({
type: '',
    status: '',
    startDate: null,
    endDate: null
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(null); // 'start' or 'end'

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['merchantTransactions', merchantId, filters, page],
    queryFn: async () => {
      let filterQuery = `filters[merchant][id][$eq]=${merchantId}`;
      
      if (filters.type) {
        filterQuery += `&filters[type][$eq]=${filters.type}`;
      }
      if (filters.status) {
        filterQuery += `&filters[status][$eq]=${filters.status}`;
      }
      if (filters.startDate) {
        filterQuery += `&filters[createdAt][$gte]=${filters.startDate.toISOString()}`;
      }
      if (filters.endDate) {
        filterQuery += `&filters[createdAt][$lte]=${filters.endDate.toISOString()}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions?` +
        `${filterQuery}&pagination[page]=${page}&pagination[pageSize]=10&` +
        `sort[0]=createdAt:desc&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
    enabled: !!merchantId
  });

  const transactions = data?.data || [];
  const pagination = data?.meta?.pagination;

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.filterModalOverlay}>
        <View style={styles.filterModalContent}>
          <View style={styles.filterHeader}>
            <ThemedText style={styles.filterTitle}>Filter Transactions</ThemedText>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Icon name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterForm}>
            <View style={styles.filterItem}>
              <ThemedText style={styles.filterLabel}>Transaction Type</ThemedText>
              <Picker
                selectedValue={filters.type}
                onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                style={styles.picker}
              >
                <Picker.Item label="All Types" value="" />
                <Picker.Item label="Deposit" value="deposit" />
                <Picker.Item label="Withdrawal" value="withdrawal" />
                <Picker.Item label="Payment" value="payment" />
                <Picker.Item label="Transfer" value="transfer" />
              </Picker>
            </View>

            <View style={styles.filterItem}>
              <ThemedText style={styles.filterLabel}>Status</ThemedText>
              <Picker
                selectedValue={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                style={styles.picker}
              >
                <Picker.Item label="All Statuses" value="" />
                <Picker.Item label="Completed" value="completed" />
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="Failed" value="failed" />
              </Picker>
            </View>

            <View style={styles.filterItem}>
              <ThemedText style={styles.filterLabel}>Date Range</ThemedText>
              <View style={styles.dateInputs}>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker('start')}
                >
                  <ThemedText>
                    {filters.startDate ? format(filters.startDate, 'MMM d, yyyy') : 'Start Date'}
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker('end')}
                >
                  <ThemedText>
                    {filters.endDate ? format(filters.endDate, 'MMM d, yyyy') : 'End Date'}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={showDatePicker === 'start' ? filters.startDate || new Date() : filters.endDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(null);
                  if (selectedDate) {
                    setFilters(prev => ({
                      ...prev,
                      [showDatePicker === 'start' ? 'startDate' : 'endDate']: selectedDate
                    }));
                  }
                }}
              />
            )}

            <View style={styles.filterActions}>
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => {
                  setShowFilters(false);
                  refetch();
                }}
              >
                <ThemedText style={styles.filterButtonText}>Apply Filters</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.filterButton, styles.resetButton]}
                onPress={() => {
                  setFilters({
                    type: '',
                    status: '',
                    startDate: null,
                    endDate: null
                  });
                  refetch();
                  setShowFilters(false);
                }}
              >
                <ThemedText style={styles.resetButtonText}>Reset</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  const TransactionDetailsModal = () => {
    if (!selectedTransaction) return null;
    const { attributes } = selectedTransaction;

    return (
      <Modal
        visible={!!selectedTransaction}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTransaction(null)}
      >
        <View style={styles.detailsModalOverlay}>
          <View style={styles.detailsModalContent}>
            <View style={styles.detailsHeader}>
              <ThemedText style={styles.detailsTitle}>Transaction Details</ThemedText>
              <TouchableOpacity onPress={() => setSelectedTransaction(null)}>
                <Icon name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.detailsBody}>
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Type</ThemedText>
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText}>{attributes.type}</ThemedText>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Amount</ThemedText>
                <ThemedText style={[
                  styles.detailValue,
                  { color: attributes.type === 'deposit' ? '#48BB78' : '#E53E3E' }
                ]}>
                  {attributes.type === 'deposit' ? '+' : '-'} {attributes.amount.toLocaleString()} {attributes.currency}
                </ThemedText>
              </View>

              {attributes.fee && (
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Fee</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {attributes.fee.toLocaleString()} {attributes.currency}
                  </ThemedText>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Date</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {format(parseISO(attributes.createdAt), 'MMMM d, yyyy, h:mm:ss a')}
                </ThemedText>
              </View>

              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Reference</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {attributes.reference || 'N/A'}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Transactions</ThemedText>
        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setShowFilters(true)}
        >
          <Icon name="filter" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onPress={setSelectedTransaction}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>No transactions found</ThemedText>
          </View>
        )}
        onEndReached={() => {
          if (pagination?.page < pagination?.pageCount) {
            setPage(prev => prev + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          pagination?.page < pagination?.pageCount ? (
            <ActivityIndicator style={styles.footerLoader} />
          ) : null
        )}
      />

      <FilterModal />
      <TransactionDetailsModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  filterToggle: {
    padding: 8
  },
  transactionItem: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8
  },
  transactionIcon: {
    marginRight: 12
  },
  transactionDetails: {
    flex: 1
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '600'
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500'
  },
  date: {
    fontSize: 12,
    color: '#666'
  },
  separator: {
    height: 8
  },
  emptyState: {
    padding: 20,
    alignItems: 'center'
  },
  emptyText: {
    color: '#666'
  },
  footerLoader: {
    padding: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  filterModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%'
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  filterForm: {
    gap: 16
  },
  filterItem: {
    gap: 8
  },
  filterLabel: {
    fontSize: 14,
    color: '#666'
  },
  picker: {
    backgroundColor: '#F7FAFC',
    borderRadius: 8
  },
  dateInputs: {
    flexDirection: 'row',
    gap: 12
  },
  dateButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    alignItems: 'center'
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20
  },
  filterButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0066cc',
    borderRadius: 8,
    alignItems: 'center'
  },
  filterButtonText: {
    color: 'white',
    fontWeight: '600'
  },
  resetButton: {
    backgroundColor: '#F7FAFC'
  },
  resetButtonText: {
    color: '#666'
  },
  detailsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20
  },
  detailsModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  detailsBody: {
    gap: 16
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  detailLabel: {
    color: '#666'
  },
  detailValue: {
    fontWeight: '500'
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8
  }
});