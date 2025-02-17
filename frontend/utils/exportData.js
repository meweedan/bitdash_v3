// utils/exportData.js
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const exportToExcel = (transactions, merchantInfo) => {
  const worksheet = XLSX.utils.json_to_sheet(transactions.map(tx => ({
    Date: format(parseISO(tx.attributes.createdAt), 'yyyy-MM-dd HH:mm:ss'),
    Type: tx.attributes.type,
    Amount: tx.attributes.amount,
    Currency: tx.attributes.currency,
    Fee: tx.attributes.fee,
    Status: tx.attributes.status,
    Reference: tx.attributes.reference,
    PaymentLink: tx.attributes.payment_link?.data?.attributes?.link_id || 'N/A'
  })));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  // Add merchant info sheet
  const infoWorksheet = XLSX.utils.json_to_sheet([{
    BusinessName: merchantInfo.businessName,
    RegistrationNumber: merchantInfo.registrationNumber,
    Address: merchantInfo.location.address,
    Phone: merchantInfo.contact.phone,
    ExportDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  }]);
  XLSX.utils.book_append_sheet(workbook, infoWorksheet, "Business Info");

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  saveAs(dataBlob, `${merchantInfo.businessName}_transactions_${format(new Date(), 'yyyyMMdd')}.xlsx`);
};