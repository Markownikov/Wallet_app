import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDollarSign, FiCreditCard, FiBriefcase, FiUser, FiCheck } from 'react-icons/fi';
import { useWallet } from '../contexts/WalletContext';
import { formatCurrency } from '../utils/currency';
import { Currency } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';

const Withdraw: React.FC = () => {
  const { balance, withdrawFunds } = useWallet();
  const navigate = useNavigate();
  
  const [currency, setCurrency] = useState<Currency>('INR');
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const allCurrencies: Currency[] = ['INR', 'USD', 'EUR', 'GBP'];

  const handleWithdraw = () => {
    // Reset error state
    setError('');
    setSuccess(false);
    
    // Validate inputs
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (numericAmount > balance[currency]) {
      setError(`Insufficient ${currency} balance`);
      return;
    }

    if (!bankName.trim()) {
      setError('Please enter a bank name');
      return;
    }

    if (!accountNumber.trim() || !/^\d{9,18}$/.test(accountNumber)) {
      setError('Please enter a valid account number (9-18 digits)');
      return;
    }

    if (!ifscCode.trim() || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      setError('Please enter a valid IFSC code (format: ABCD0123456)');
      return;
    }

    // Process withdrawal
    const success = withdrawFunds(numericAmount, currency, {
      bankName,
      accountNumber,
      ifscCode
    });
    
    if (success) {
      setSuccess(true);
      // Reset form
      setAmount('');
      setBankName('');
      setAccountNumber('');
      setIfscCode('');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setError('Withdrawal failed. Please try again.');
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
                <FiCreditCard className="h-8 w-8 text-indigo-600" />
                <h1 className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                  Withdraw Funds
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
        <motion.div variants={itemVariants} className="mb-8">
          <h3 className="text-lg font-medium mb-4">Available Balances</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allCurrencies.map((curr) => (
              <motion.div
                key={curr}
                className={`bg-white border rounded-xl shadow-sm p-4 ${
                  currency === curr ? 'ring-2 ring-indigo-500' : ''
                }`}
                whileHover={{ y: -5 }}
              >
                <p className="text-sm text-gray-500">{curr} Balance</p>
                <p className="text-xl font-bold">{formatCurrency(balance[curr], curr)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Withdraw to Bank Account</h2>

              {success && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center"
                >
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <FiCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-green-700">
                    Withdrawal successful! Redirecting to dashboard...
                  </p>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                >
                  <p className="text-red-700 flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </p>
                </motion.div>
              )}

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Select
                      id="currency"
                      label="Currency"
                      value={currency}
                      onChange={(value) => setCurrency(value as Currency)}
                      options={allCurrencies.map(curr => ({ value: curr, label: curr }))}
                    />
                  </div>

                  <div>
                    <Input
                      type="number"
                      id="amount"
                      label="Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount to withdraw"
                      min="0"
                      max={balance[currency].toString()}
                      icon={<FiDollarSign className="text-gray-400" />}
                      helper={`Max: ${formatCurrency(balance[currency], currency)}`}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <h3 className="text-md font-semibold mb-4 flex items-center">
                    <FiBriefcase className="mr-2" /> Bank Account Details
                  </h3>
                  
                  <div className="mb-4">
                    <Input
                      type="text"
                      id="bankName"
                      label="Bank Name"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Enter your bank name"
                      icon={<FiBriefcase className="text-gray-400" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        type="text"
                        id="accountNumber"
                        label="Account Number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="9-18 digits"
                        icon={<FiUser className="text-gray-400" />}
                      />
                    </div>

                    <div>
                      <Input
                        type="text"
                        id="ifscCode"
                        label="IFSC Code"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        placeholder="e.g., ABCD0123456"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleWithdraw}
                    disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance[currency]}
                  >
                    Withdraw Funds
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Withdraw;
