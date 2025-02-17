import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { 
  ArrowDownLeft, ArrowUpRight, Filter, RefreshCcw, ChevronLeft, 
  ChevronRight, X, Calendar, ChevronDown, ChevronUp 
} from 'lucide-react';

const TransactionsList = ({ merchantId }) => {
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTransaction, setExpandedTransaction] = useState(null);

  const { data: transactionsData, isLoading, refetch } = useQuery({
    queryKey: ['merchantTransactions', merchantId, filters, page, pageSize],
    queryFn: async () => {
      let filterQuery = `filters[merchant][id][$eq]=${merchantId}`;
      
      if (filters.type) filterQuery += `&filters[type][$eq]=${filters.type}`;
      if (filters.status) filterQuery += `&filters[status][$eq]=${filters.status}`;
      if (filters.startDate) filterQuery += `&filters[createdAt][$gte]=${filters.startDate}`;
      if (filters.endDate) filterQuery += `&filters[createdAt][$lte]=${filters.endDate}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions?` +
        `${filterQuery}&` +
        `pagination[page]=${page}&` +
        `pagination[pageSize]=${pageSize}&` +
        `sort[0]=createdAt:desc&` +
        `populate=*`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
    enabled: !!merchantId
  });

  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit': return 'text-green-600 dark:text-green-400';
      case 'withdrawal': return 'text-red-600 dark:text-red-400';
      case 'transfer': return 'text-blue-600 dark:text-blue-400';
      case 'payment': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bitcash-500"></div>
      </div>
    );
  }

  if (!transactionsData?.data?.length) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="relative">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showFilters && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="">All Types</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="payment">Payment</option>
                <option value="transfer">Transfer</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <div className="flex items-center space-x-2 col-span-full">
                <Calendar className="w-4 h-4" />
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="Start Date"
                />
                <span>to</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="End Date"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setFilters({
                    type: '',
                    status: '',
                    startDate: '',
                    endDate: ''
                  });
                  refetch();
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  setShowFilters(false);
                  refetch();
                }}
                className="px-4 py-2 text-sm bg-bitcash-500 text-white rounded-lg hover:bg-bitcash-600 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {transactionsData.data.map((transaction) => (
          <div 
            key={transaction.id}
            className="border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden shadow-sm"
          >
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedTransaction(
                expandedTransaction === transaction.id ? null : transaction.id
              )}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${getTransactionColor(transaction.attributes.type)}`}>
                      {transaction.attributes.type === 'deposit' ? 
                        <ArrowDownLeft className="w-5 h-5" /> : 
                        <ArrowUpRight className="w-5 h-5" />
                      }
                    </div>
                    <div>
                      <div className="font-medium">
                        {transaction.attributes.type.charAt(0).toUpperCase() + transaction.attributes.type.slice(1)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(parseISO(transaction.attributes.createdAt), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getTransactionColor(transaction.attributes.type)}`}>
                      {transaction.attributes.type === 'deposit' ? '+' : '-'} 
                      {transaction.attributes.amount.toLocaleString()} {transaction.attributes.currency}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.attributes.status)}`}>
                      {transaction.attributes.status}
                    </span>
                  </div>
                </div>

                {expandedTransaction === transaction.id && (
                  <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Reference</div>
                        <div className="font-medium">{transaction.attributes.reference || 'N/A'}</div>
                      </div>
                      {transaction.attributes.fee > 0 && (
                        <div>
                          <div className="text-sm text-gray-500">Fee</div>
                          <div className="font-medium">
                            {transaction.attributes.fee.toLocaleString()} {transaction.attributes.currency}
                          </div>
                        </div>
                      )}
                    </div>

                    {transaction.attributes.metadata && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Additional Details</div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          {Object.entries(transaction.attributes.metadata).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-gray-500">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                              <div>{String(value)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-gray-500">
          Page {transactionsData.meta.pagination.page} of {transactionsData.meta.pagination.pageCount}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page <= 1}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setPage(prev => Math.min(transactionsData.meta.pagination.pageCount, prev + 1))}
            disabled={page >= transactionsData.meta.pagination.pageCount}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsList;