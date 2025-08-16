export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export type TransactionType = 'ADD' | 'WITHDRAW' | 'EXCHANGE';

export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED';

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  type: TransactionType;
  status: TransactionStatus;
  timestamp: number;
  description?: string;
  exchangeDetails?: {
    fromCurrency: Currency;
    toCurrency: Currency;
    fromAmount: number;
    toAmount: number;
    rate: number;
  };
  withdrawDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };
}

export interface WalletBalance {
  INR: number;
  USD: number;
  EUR: number;
  GBP: number;
}

export interface User {
  mobileNumber: string;
  isVerified: boolean;
}
