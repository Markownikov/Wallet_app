import React, { createContext, useState, useEffect, useContext } from 'react';
import { Currency, Transaction, WalletBalance, User, TransactionType } from '../types';
import { convertCurrency, generateId } from '../utils/currency';

interface WalletContextType {
  user: User | null;
  login: (mobileNumber: string) => void;
  verify: (otp: string) => boolean;
  logout: () => void;
  balance: WalletBalance;
  transactions: Transaction[];
  addFunds: (amount: number, currency: Currency) => void;
  withdrawFunds: (amount: number, currency: Currency, bankDetails: { 
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  }) => boolean;
  exchangeCurrency: (
    fromCurrency: Currency,
    toCurrency: Currency,
    amount: number
  ) => boolean;
  getFilteredTransactions: (filters: {
    startDate?: Date;
    endDate?: Date;
    type?: TransactionType;
    status?: string;
  }) => Transaction[];
}

const defaultBalance: WalletBalance = {
  INR: 1000, // Default balance as per requirements
  USD: 0,
  EUR: 10,  // Adding some initial value for EUR
  GBP: 15   // Adding some initial value for GBP
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load data from localStorage or use defaults
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('wallet_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [balance, setBalance] = useState<WalletBalance>(() => {
    const savedBalance = localStorage.getItem('wallet_balance');
    
    if (savedBalance) {
      // If we have existing data, keep it
      return JSON.parse(savedBalance);
    } else {
      // For new users, use our default balance
      return defaultBalance;
    }
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('wallet_transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('wallet_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('wallet_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('wallet_balance', JSON.stringify(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('wallet_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // User authentication
  const login = (mobileNumber: string) => {
    setUser({ mobileNumber, isVerified: false });
  };

  const verify = (otp: string) => {
    // Dummy OTP verification - always accept "1234"
    if (otp === "1234" && user) {
      setUser({ ...user, isVerified: true });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  // Wallet operations
  const addFunds = (amount: number, currency: Currency) => {
    if (amount <= 0) return;

    // Update balance
    setBalance(prev => ({
      ...prev,
      [currency]: prev[currency] + amount
    }));

    // Add transaction record
    const newTransaction: Transaction = {
      id: generateId(),
      amount,
      currency,
      type: 'ADD',
      status: 'COMPLETED',
      timestamp: Date.now(),
      description: `Added ${amount} ${currency}`
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const withdrawFunds = (
    amount: number, 
    currency: Currency, 
    bankDetails: { bankName: string; accountNumber: string; ifscCode: string }
  ) => {
    if (amount <= 0 || balance[currency] < amount) return false;

    // Update balance
    setBalance(prev => ({
      ...prev,
      [currency]: prev[currency] - amount
    }));

    // Add transaction record
    const newTransaction: Transaction = {
      id: generateId(),
      amount,
      currency,
      type: 'WITHDRAW',
      status: 'COMPLETED',
      timestamp: Date.now(),
      description: `Withdrew ${amount} ${currency}`,
      withdrawDetails: bankDetails
    };

    setTransactions(prev => [newTransaction, ...prev]);
    return true;
  };

  const exchangeCurrency = (fromCurrency: Currency, toCurrency: Currency, amount: number) => {
    if (amount <= 0 || balance[fromCurrency] < amount) return false;

    const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);
    const rate = convertedAmount / amount;

    // Update balances
    setBalance(prev => ({
      ...prev,
      [fromCurrency]: prev[fromCurrency] - amount,
      [toCurrency]: prev[toCurrency] + convertedAmount
    }));

    // Add transaction record
    const newTransaction: Transaction = {
      id: generateId(),
      amount,
      currency: fromCurrency,
      type: 'EXCHANGE',
      status: 'COMPLETED',
      timestamp: Date.now(),
      description: `Exchanged ${amount} ${fromCurrency} to ${convertedAmount} ${toCurrency}`,
      exchangeDetails: {
        fromCurrency,
        toCurrency,
        fromAmount: amount,
        toAmount: convertedAmount,
        rate
      }
    };

    setTransactions(prev => [newTransaction, ...prev]);
    return true;
  };

  const getFilteredTransactions = (filters: {
    startDate?: Date;
    endDate?: Date;
    type?: TransactionType;
    status?: string;
  }) => {
    return transactions.filter(transaction => {
      // Filter by date range
      if (filters.startDate && transaction.timestamp < filters.startDate.getTime()) {
        return false;
      }
      
      if (filters.endDate) {
        // Add one day to include the end date fully
        const endDateTimestamp = new Date(filters.endDate).setHours(23, 59, 59, 999);
        if (transaction.timestamp > endDateTimestamp) {
          return false;
        }
      }

      // Filter by type
      if (filters.type && transaction.type !== filters.type) {
        return false;
      }

      // Filter by status
      if (filters.status && transaction.status !== filters.status) {
        return false;
      }

      return true;
    });
  };

  return (
    <WalletContext.Provider
      value={{
        user,
        login,
        verify,
        logout,
        balance,
        transactions,
        addFunds,
        withdrawFunds,
        exchangeCurrency,
        getFilteredTransactions
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
