import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiRefreshCw, FiDollarSign, FiClock, FiArrowRight, FiArrowUp, FiArrowDown, FiSmartphone, FiAward, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { useWallet } from '../contexts/WalletContext';
import { formatCurrency } from '../utils/currency';
import { Currency, Transaction } from '../types';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';

const Dashboard: React.FC = () => {
  const { balance, transactions, addFunds, user } = useWallet();
  const [addAmount, setAddAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('INR');
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // All supported currencies
  const allCurrencies: Currency[] = ['INR', 'USD', 'EUR', 'GBP'];
  
  // Handle adding funds to wallet
  const handleAddFunds = () => {
    const amount = parseFloat(addAmount);
    if (!isNaN(amount) && amount > 0) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        addFunds(amount, selectedCurrency);
        setAddAmount('');
        setIsLoading(false);
        setIsAddingFunds(false);
      }, 1000);
    }
  };

  // Get transaction status badge color
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
        return <FiClock className="text-gray-500" />;
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-indigo-300/10 to-purple-300/10"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: Math.random() * 20 + 10,
            }}
          />
        ))}
      </div>
    
      {/* Header/Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div 
                className="flex-shrink-0 flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <FiDollarSign className="h-6 w-6 text-white" />
                </div>
                <h1 className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Wallet App
                </h1>
              </motion.div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.div 
                className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-sm text-indigo-700 font-medium shadow-sm border border-indigo-100"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="flex items-center">
                  <FiSmartphone className="mr-1" /> {user?.mobileNumber}
                </span>
              </motion.div>
              
              <div 
                className="flex items-center space-x-2"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link to="/transactions">
                    <Button 
                      variant="secondary" 
                      className="text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 shadow-sm"
                    >
                      Transactions
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link to="/withdraw">
                    <Button 
                      variant="secondary" 
                      className="text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 shadow-sm"
                    >
                      Withdraw
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link to="/exchange">
                    <Button 
                      variant="secondary" 
                      className="text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 shadow-sm"
                    >
                      Exchange
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link to="/">
                    <Button 
                      variant="danger" 
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-md"
                    >
                      Logout
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
      >
        {/* Balance Cards */}
        <motion.div variants={itemVariants} className="relative">
          <motion.h2 
            className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 inline-block"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Your Balances
            <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allCurrencies.map((currency, index) => {
              // Different color schemes for each currency
              const colorSchemes = [
                { from: 'from-indigo-500', to: 'to-purple-500', bg: 'bg-indigo-100', text: 'text-indigo-600', icon: <FiDollarSign /> },
                { from: 'from-green-500', to: 'to-teal-500', bg: 'bg-green-100', text: 'text-green-600', icon: <FiTrendingUp /> },
                { from: 'from-blue-500', to: 'to-cyan-500', bg: 'bg-blue-100', text: 'text-blue-600', icon: <FiActivity /> },
                { from: 'from-purple-500', to: 'to-pink-500', bg: 'bg-purple-100', text: 'text-purple-600', icon: <FiAward /> }
              ];
              const scheme = colorSchemes[index % colorSchemes.length];
              
              return (
                <motion.div
                  key={currency}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                  whileHover={{ 
                    y: -10, 
                    boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)",
                    scale: 1.02
                  }}
                  className="relative overflow-hidden"
                >
                  <Card className="border-t-4 border-t-transparent bg-white/90 backdrop-blur-sm hover:bg-white/100 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br opacity-10 ${scheme.from} ${scheme.to}"></div>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${scheme.from} ${scheme.to}"></div>
                    <div className="p-6 relative">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 mb-1">{currency}</h3>
                          <p className="text-xs text-gray-500">Current Balance</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full ${scheme.bg} flex items-center justify-center shadow-inner`}>
                          <span className={scheme.text}>
                            {scheme.icon}
                          </span>
                        </div>
                      </div>
                      <motion.p 
                        className="text-3xl font-bold text-gray-900"
                        initial={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {formatCurrency(balance[currency], currency)}
                      </motion.p>
                      
                      {/* Add subtle decoration */}
                      <div className="absolute bottom-2 right-2 opacity-10">
                        <div className="text-6xl font-bold text-gray-900">
                          {currency.charAt(0)}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Add Funds Section */}
        <motion.div 
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border-none shadow-lg bg-gradient-to-br from-white/60 to-white/90 backdrop-blur-sm overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-purple-300/30 rounded-full -mr-10 -mt-10 z-0"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-indigo-300/30 rounded-full -ml-10 -mb-10 z-0"></div>
            
            <div className="p-6 relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <motion.div 
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-md"
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 10 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  whileHover={{ rotate: 0 }}
                >
                  <FiPlus className="text-white" />
                </motion.div>
                <motion.h3 
                  className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Add Funds to Your Wallet
                </motion.h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Input
                      id="amount"
                      type="number"
                      label="Amount"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="0"
                      icon={<FiDollarSign className="text-indigo-500" />}
                      className="focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </motion.div>
                </div>
                <div className="md:col-span-3">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Select
                      id="currency"
                      label="Currency"
                      value={selectedCurrency}
                      onChange={(value) => setSelectedCurrency(value as Currency)}
                      options={allCurrencies.map(curr => ({ value: curr, label: curr }))}
                    />
                  </motion.div>
                </div>
                <div className="md:col-span-4 flex items-end">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                  >
                    <Button 
                      onClick={handleAddFunds}
                      disabled={isLoading || addAmount === '' || parseFloat(addAmount) <= 0}
                      className="flex items-center justify-center w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <FiPlus className="mr-2" /> Add Funds
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
              
              {/* Quick add buttons */}
              <motion.div 
                className="mt-4 flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p className="text-xs text-gray-500 mr-2 flex items-center">Quick Add:</p>
                {[100, 500, 1000, 5000].map((amount, i) => (
                  <motion.button
                    key={amount}
                    className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100"
                    onClick={() => setAddAmount(amount.toString())}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + (i * 0.1) }}
                  >
                    +{amount}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div 
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8"
        >
          <div className="flex justify-between items-center mb-6">
            <motion.h2 
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              Recent Transactions
              <div className="mt-1 w-16 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/transactions">
                <Button 
                  variant="secondary" 
                  className="flex items-center bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100"
                >
                  View All <FiArrowRight className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
          
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="p-0">
              {transactions.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {transactions.slice(0, 5).map((transaction, index) => {
                    // Determine color scheme based on transaction type
                    const getScheme = (type: string) => {
                      switch(type) {
                        case 'ADD': 
                          return { bg: 'bg-green-50', iconBg: 'bg-green-100', ring: 'ring-green-200', text: 'text-green-600' };
                        case 'WITHDRAW': 
                          return { bg: 'bg-red-50', iconBg: 'bg-red-100', ring: 'ring-red-200', text: 'text-red-600' };
                        case 'EXCHANGE': 
                          return { bg: 'bg-blue-50', iconBg: 'bg-blue-100', ring: 'ring-blue-200', text: 'text-blue-600' };
                        default:
                          return { bg: 'bg-gray-50', iconBg: 'bg-gray-100', ring: 'ring-gray-200', text: 'text-gray-600' };
                      }
                    };
                    
                    const scheme = getScheme(transaction.type);
                    
                    return (
                      <motion.div
                        key={transaction.id}
                        className={`p-4 hover:${scheme.bg} transition-all duration-300`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + (index * 0.1) }}
                        whileHover={{ backgroundColor: scheme.bg, scale: 1.01 }}
                      >
                        <div className="flex items-center">
                          <motion.div 
                            className={`h-12 w-12 rounded-full ${scheme.iconBg} ring-4 ${scheme.ring}/30 flex items-center justify-center mr-4 shadow-sm`}
                            whileHover={{ scale: 1.1, rotate: 10 }}
                          >
                            {getTransactionIcon(transaction.type)}
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-gray-900">{transaction.type}</p>
                                <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
                              </div>
                              <div className="text-right">
                                <p className={`font-bold text-lg ${
                                  transaction.type === 'ADD' ? 'text-green-600' : 
                                  transaction.type === 'WITHDRAW' ? 'text-red-600' : 
                                  'text-blue-600'
                                }`}>
                                  {transaction.type === 'ADD' ? '+' : transaction.type === 'WITHDRAW' ? '-' : ''}
                                  {formatCurrency(transaction.amount, transaction.currency)}
                                </p>
                                <Badge variant={getStatusColor(transaction.status)} className="mt-1">
                                  {transaction.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-16 px-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: "spring" }}
                    className="inline-block"
                  >
                    <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                      <FiClock className="h-8 w-8 text-indigo-400" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No transactions yet</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Your transaction history will appear here. Start by adding funds to your wallet.
                  </p>
                  <motion.div 
                    className="mt-6"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      onClick={() => setIsAddingFunds(true)}
                    >
                      <FiPlus className="mr-2" /> Add Your First Funds
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
        {/* Stats or Quick Info Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div 
            className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-md border border-indigo-100"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <FiTrendingUp className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(
                    Object.values(balance).reduce((sum, val) => sum + val, 0), 
                    'USD'
                  )}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 shadow-md border border-purple-100"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <FiActivity className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Active Currencies</h3>
                <p className="text-xl font-bold text-gray-900">
                  {Object.entries(balance).filter(([_, val]) => val > 0).length} / {allCurrencies.length}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-md border border-blue-100"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FiRefreshCw className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Transactions</h3>
                <p className="text-xl font-bold text-gray-900">
                  {transactions.length}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Footer with wave decoration */}
      <div className="mt-16 relative">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
          <svg 
            data-name="Layer 1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="relative block w-full h-16"
          >
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              opacity=".25" 
              className="fill-indigo-500"
            ></path>
            <path 
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
              opacity=".5" 
              className="fill-indigo-500"
            ></path>
            <path 
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
              className="fill-indigo-500"
            ></path>
          </svg>
        </div>
        
        <div className="bg-indigo-600 text-white py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mr-3">
                <FiDollarSign className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-bold text-lg">Wallet App</p>
                <p className="text-indigo-200 text-sm">Manage your finances with ease</p>
              </div>
            </div>
            
            <div className="flex space-x-6">
              <div>
                <h4 className="font-medium mb-2 text-sm text-indigo-200">CURRENCIES</h4>
                <div className="flex space-x-2">
                  {allCurrencies.map(curr => (
                    <div key={curr} className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-medium">
                      {curr.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-right">
                <h4 className="font-medium mb-2 text-sm text-indigo-200">QUICK LINKS</h4>
                <div className="space-y-1 text-sm">
                  <p><Link to="/transactions" className="hover:text-indigo-200">Transactions</Link></p>
                  <p><Link to="/exchange" className="hover:text-indigo-200">Exchange</Link></p>
                  <p><Link to="/withdraw" className="hover:text-indigo-200">Withdraw</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
