import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiFilter, FiDownload, FiFileText, FiX, FiArrowUp, FiArrowDown, FiRefreshCw } from 'react-icons/fi';
import { useWallet } from '../contexts/WalletContext';
import { formatCurrency, formatDate } from '../utils/currency';
import { exportToPDF, exportToExcel, exportToCSV } from '../utils/export';
import { TransactionType, TransactionStatus } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const Transactions: React.FC = () => {
  const { transactions, getFilteredTransactions } = useWallet();
  const navigate = useNavigate();
  
  // Filter states
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  const transactionTypes = ['ADD', 'WITHDRAW', 'EXCHANGE'];
  const transactionStatuses = ['COMPLETED', 'PENDING', 'FAILED'];
  
  // Apply filters
  const filteredTransactions = getFilteredTransactions({
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    type: type as TransactionType | undefined,
    status,
  });
  
  // Check if any filters are active
  const hasActiveFilters = startDate || endDate || type || status;
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'danger';
      default:
        return 'default';
    }
  };
  
  // Get transaction type icon
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'ADD':
        return <FiArrowUp className="text-green-500" />;
      case 'WITHDRAW':
        return <FiArrowDown className="text-red-500" />;
      case 'EXCHANGE':
        return <FiRefreshCw className="text-blue-500" />;
      default:
        return null;
    }
  };
  
  // Export functions
  const handleExport = (exportType: 'pdf' | 'excel' | 'csv') => {
    if (filteredTransactions.length === 0) {
      alert('No transactions to export');
      return;
    }
    
    switch (exportType) {
      case 'pdf':
        exportToPDF(filteredTransactions);
        break;
      case 'excel':
        exportToExcel(filteredTransactions);
        break;
      case 'csv':
        exportToCSV(filteredTransactions);
        break;
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setType('');
    setStatus('');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header/Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="secondary"
                className="mr-4 flex items-center" 
                onClick={() => navigate('/dashboard')}
              >
                <FiArrowLeft className="mr-2" /> Back to Dashboard
              </Button>
              <div className="flex-shrink-0 flex items-center">
                <FiFileText className="h-8 w-8 text-indigo-600" />
                <h1 className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                  Transaction History
                </h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <motion.div 
        className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card>
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold">Transactions</h2>
                  {hasActiveFilters && (
                    <Badge variant="info" className="ml-3">
                      Filtered
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={showFilters ? "primary" : "secondary"} 
                    className="flex items-center"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? <FiX className="mr-2" /> : <FiFilter className="mr-2" />}
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </Button>
                  
                  <div className="relative group">
                    <Button 
                      variant="secondary" 
                      className="flex items-center"
                    >
                      <FiDownload className="mr-2" /> Export
                    </Button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                      <div className="py-1">
                        <button
                          onClick={() => handleExport('pdf')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiFileText className="mr-2 text-red-500" /> Export as PDF
                        </button>
                        <button
                          onClick={() => handleExport('excel')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiFileText className="mr-2 text-green-500" /> Export as Excel
                        </button>
                        <button
                          onClick={() => handleExport('csv')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiFileText className="mr-2 text-blue-500" /> Export as CSV
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input
                          type="date"
                          id="startDate"
                          label="Start Date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                        
                        <Input
                          type="date"
                          id="endDate"
                          label="End Date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                        
                        <Select
                          id="type"
                          label="Type"
                          value={type}
                          onChange={(value) => setType(value)}
                          options={[
                            { value: "", label: "All Types" },
                            ...transactionTypes.map(t => ({ value: t, label: t }))
                          ]}
                        />
                        
                        <Select
                          id="status"
                          label="Status"
                          value={status}
                          onChange={(value) => setStatus(value)}
                          options={[
                            { value: "", label: "All Statuses" },
                            ...transactionStatuses.map(s => ({ value: s, label: s }))
                          ]}
                        />
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="secondary"
                          onClick={clearFilters}
                          disabled={!hasActiveFilters}
                          className="flex items-center"
                        >
                          <FiX className="mr-2" /> Clear Filters
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Transactions List */}
              {filteredTransactions.length > 0 ? (
                <div className="mt-4">
                  <div className="overflow-x-auto bg-white rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTransactions.map((transaction, index) => (
                          <motion.tr 
                            key={transaction.id}
                            variants={itemVariants}
                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{formatDate(transaction.timestamp)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="mr-2">
                                  {getTransactionIcon(transaction.type)}
                                </span>
                                <span className="text-sm font-medium text-gray-900">{transaction.type}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm font-medium ${
                                transaction.type === 'ADD' ? 'text-green-600' : 
                                transaction.type === 'WITHDRAW' ? 'text-red-600' : 
                                'text-blue-600'
                              }`}>
                                {transaction.type === 'ADD' ? '+' : transaction.type === 'WITHDRAW' ? '-' : ''}
                                {formatCurrency(transaction.amount, transaction.currency)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={getStatusColor(transaction.status)}>
                                {transaction.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-normal">
                              <div className="text-sm text-gray-500">
                                {transaction.description}
                                {transaction.exchangeDetails && (
                                  <div className="text-xs mt-1 bg-blue-50 p-1 rounded">
                                    Exchanged {transaction.exchangeDetails.fromAmount} {transaction.exchangeDetails.fromCurrency} to{' '}
                                    {transaction.exchangeDetails.toAmount} {transaction.exchangeDetails.toCurrency}
                                  </div>
                                )}
                                {transaction.withdrawDetails && (
                                  <div className="text-xs mt-1 bg-gray-50 p-1 rounded">
                                    To: {transaction.withdrawDetails.bankName} / {transaction.withdrawDetails.accountNumber}
                                  </div>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-right text-sm text-gray-500">
                    Showing {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
                  <div className="inline-flex items-center justify-center h-16 w-16 bg-gray-100 rounded-full mb-4">
                    <FiFileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions found</h3>
                  <p className="text-sm text-gray-500">
                    {hasActiveFilters ? 
                      'Try adjusting your filters to see more results' : 
                      'Your transactions will appear here once you make some'}
                  </p>
                  {hasActiveFilters && (
                    <div className="mt-6">
                      <Button variant="secondary" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Transactions;
