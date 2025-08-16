 import { Currency } from '../types';

// Fixed exchange rates as per requirements
export const EXCHANGE_RATES: Record<Currency, Record<Currency, number>> = {
  INR: {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.009
  },
  USD: {
    INR: 83.33, // 1/0.012
    USD: 1,
    EUR: 0.917, // 0.011/0.012
    GBP: 0.75 // 0.009/0.012
  },
  EUR: {
    INR: 90.91, // 1/0.011
    USD: 1.091, // 0.012/0.011
    EUR: 1,
    GBP: 0.818 // 0.009/0.011
  },
  GBP: {
    INR: 111.11, // 1/0.009
    USD: 1.333, // 0.012/0.009
    EUR: 1.222, // 0.011/0.009
    GBP: 1
  }
};

// Function to convert amount between currencies
export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number => {
  const rate = EXCHANGE_RATES[fromCurrency][toCurrency];
  return Number((amount * rate).toFixed(2));
};

// Format currency with symbol
export const formatCurrency = (amount: number, currency: Currency): string => {
  const symbols: Record<Currency, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  return `${symbols[currency]}${amount.toFixed(2)}`;
};

// Generate a unique ID for transactions
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Format date for display
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
