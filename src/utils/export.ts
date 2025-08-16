import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from './currency';

export const exportToPDF = (transactions: Transaction[]): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text("Transaction History", 14, 22);
  
  // Add date
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  
  // Create table
  doc.setFontSize(10);
  const tableColumn = ["Date", "Type", "Amount", "Status", "Description"];
  const tableRows: any[][] = [];

  transactions.forEach((transaction) => {
    const formattedAmount = formatCurrency(transaction.amount, transaction.currency);
    const formattedDate = formatDate(transaction.timestamp);
    
    const tableRow = [
      formattedDate,
      transaction.type,
      formattedAmount,
      transaction.status,
      transaction.description || ''
    ];
    tableRows.push(tableRow);
  });

  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
  });
  
  // Save PDF file
  doc.save("transaction_history.pdf");
};

export const exportToExcel = (transactions: Transaction[]): void => {
  // Prepare data for excel
  const excelData = transactions.map(transaction => ({
    Date: formatDate(transaction.timestamp),
    Type: transaction.type,
    Amount: `${transaction.amount} ${transaction.currency}`,
    Status: transaction.status,
    Description: transaction.description || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Save file
  saveAs(data, "transaction_history.xlsx");
};

export const exportToCSV = (transactions: Transaction[]): void => {
  // Prepare data for CSV
  const csvData = transactions.map(transaction => ({
    Date: formatDate(transaction.timestamp),
    Type: transaction.type,
    Amount: `${transaction.amount} ${transaction.currency}`,
    Status: transaction.status,
    Description: transaction.description || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(csvData);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  
  // Create blob and save
  const data = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(data, "transaction_history.csv");
};
