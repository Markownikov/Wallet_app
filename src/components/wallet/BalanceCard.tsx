import React from 'react';
import { motion } from 'framer-motion';
import { Currency } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface BalanceCardProps {
  currency: Currency;
  balance: number;
}

const currencyIcons: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

const currencyColors: Record<Currency, string> = {
  INR: 'from-purple-500 to-indigo-600',
  USD: 'from-green-500 to-emerald-600',
  EUR: 'from-blue-500 to-sky-600',
  GBP: 'from-pink-500 to-rose-600'
};

const BalanceCard: React.FC<BalanceCardProps> = ({ currency, balance }) => {
  return (
    <motion.div
      className="rounded-card overflow-hidden"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className={`bg-gradient-to-br ${currencyColors[currency]} p-6 text-white`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white text-opacity-80 text-sm font-medium">{currency} Balance</p>
            <h2 className="mt-1 text-3xl font-bold">{formatCurrency(balance, currency)}</h2>
          </div>
          <div className="bg-white bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">
            {currencyIcons[currency]}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BalanceCard;
