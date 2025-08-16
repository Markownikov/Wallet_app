import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowDown, FiRefreshCw, FiDollarSign, FiArrowLeft } from 'react-icons/fi';
import { useWallet } from '../contexts/WalletContext';
import { formatCurrency, convertCurrency, EXCHANGE_RATES } from '../utils/currency';
import { Currency } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';

const ExchangeCurrency: React.FC = () => {
  const { balance, exchangeCurrency } = useWallet();
  const navigate = useNavigate();
  
  const [fromCurrency, setFromCurrency] = useState<Currency>('INR');
  const [toCurrency, setToCurrency] = useState<Currency>('USD');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [error, setError] = useState('');

  const allCurrencies: Currency[] = ['INR', 'USD', 'EUR', 'GBP'];

  // Calculate conversion whenever inputs change
  useEffect(() => {
    const numericAmount = parseFloat(amount);
    
    if (!isNaN(numericAmount) && numericAmount > 0) {
      const converted = convertCurrency(numericAmount, fromCurrency, toCurrency);
      setConvertedAmount(converted);
      setError('');
    } else {
      setConvertedAmount(0);
    }
  }, [amount, fromCurrency, toCurrency]);

  const handleExchange = () => {
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (numericAmount > balance[fromCurrency]) {
      setError(`Insufficient ${fromCurrency} balance`);
      return;
    }

    const success = exchangeCurrency(fromCurrency, toCurrency, numericAmount);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Exchange failed. Please try again.');
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
  
  // Function to handle currency switch
  const handleSwitchCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
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
                <FiDollarSign className="h-8 w-8 text-indigo-600" />
                <h1 className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                  Currency Exchange
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
              <h2 className="text-2xl font-bold mb-8 text-center">Exchange Currency</h2>
              
              {/* Balance Cards */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Available Balances</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {allCurrencies.map((currency) => (
                    <motion.div
                      key={currency}
                      className={`bg-white border rounded-xl shadow-sm p-4 ${
                        fromCurrency === currency ? 'ring-2 ring-indigo-500' : ''
                      }`}
                      whileHover={{ y: -5 }}
                    >
                      <p className="text-sm text-gray-500">{currency} Balance</p>
                      <p className="text-xl font-bold">{formatCurrency(balance[currency], currency)}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Exchange Form */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  {/* From Currency */}
                  <div>
                    <div className="mb-6">
                      <Select
                        id="fromCurrency"
                        label="From Currency"
                        value={fromCurrency}
                        onChange={(value) => {
                          const newCurrency = value as Currency;
                          if (newCurrency === toCurrency) {
                            const differentCurrency = allCurrencies.find(c => c !== newCurrency) as Currency;
                            setToCurrency(differentCurrency);
                          }
                          setFromCurrency(newCurrency);
                        }}
                        options={allCurrencies.map(curr => ({ value: curr, label: curr }))}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <Input
                        id="amount"
                        type="number"
                        label="Amount to Exchange"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="0"
                        error={error}
                      />
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-6">
                      Available: {formatCurrency(balance[fromCurrency], fromCurrency)}
                    </div>
                  </div>
                  
                  {/* Switch Button (visible only on wider screens) */}
                  <div className="hidden md:flex justify-center items-center">
                    <Button
                      variant="secondary"
                      onClick={handleSwitchCurrencies}
                      className="rounded-full h-12 w-12 flex items-center justify-center"
                    >
                      <FiRefreshCw size={20} />
                    </Button>
                  </div>
                  
                  {/* Switch Button (visible only on mobile) */}
                  <div className="md:hidden flex justify-center items-center mb-4">
                    <Button
                      variant="secondary"
                      onClick={handleSwitchCurrencies}
                      className="rounded-full h-10 w-10 flex items-center justify-center"
                    >
                      <FiArrowDown size={20} />
                    </Button>
                  </div>
                  
                  {/* To Currency */}
                  <div>
                    <div className="mb-6">
                      <Select
                        id="toCurrency"
                        label="To Currency"
                        value={toCurrency}
                        onChange={(value) => {
                          const newCurrency = value as Currency;
                          if (newCurrency === fromCurrency) {
                            const differentCurrency = allCurrencies.find(c => c !== newCurrency) as Currency;
                            setFromCurrency(differentCurrency);
                          }
                          setToCurrency(newCurrency);
                        }}
                        options={allCurrencies.map(curr => ({ value: curr, label: curr }))}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        You'll Receive
                      </label>
                      <div className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm py-3 px-4 bg-white text-gray-700 font-bold text-xl">
                        {formatCurrency(convertedAmount, toCurrency)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <p className="text-sm text-indigo-700 font-medium flex items-center">
                    <FiRefreshCw className="mr-2" />
                    Exchange Rate: 1 {fromCurrency} = {EXCHANGE_RATES[fromCurrency][toCurrency]} {toCurrency}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/dashboard')}
                  className="mr-4"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExchange}
                  disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance[fromCurrency]}
                >
                  Exchange Now
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ExchangeCurrency;
