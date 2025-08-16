import React from 'react';
import { FiArrowUp, FiArrowDown, FiRefreshCw } from 'react-icons/fi';
import Badge from '../ui/Badge';
import { Transaction as TransactionType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/currency';

interface TransactionItemProps {
  transaction: TransactionType;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const getIcon = () => {
    switch (transaction.type) {
      case 'ADD':
        return (
          <div className="bg-success-100 rounded-full p-2 text-success-700">
            <FiArrowDown size={16} />
          </div>
        );
      case 'WITHDRAW':
        return (
          <div className="bg-danger-100 rounded-full p-2 text-danger-700">
            <FiArrowUp size={16} />
          </div>
        );
      case 'EXCHANGE':
        return (
          <div className="bg-primary-100 rounded-full p-2 text-primary-700">
            <FiRefreshCw size={16} />
          </div>
        );
    }
  };

  const getVariant = () => {
    switch (transaction.status) {
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

  return (
    <div className="p-4 border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center">
        <div className="mr-4">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900">
                {transaction.type === 'ADD' && 'Added Funds'}
                {transaction.type === 'WITHDRAW' && 'Withdrew Funds'}
                {transaction.type === 'EXCHANGE' && 'Exchanged Currency'}
              </h4>
              <p className="text-sm text-gray-500">{formatDate(transaction.timestamp)}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="font-medium">
                {transaction.type === 'ADD' ? '+' : '-'} 
                {formatCurrency(transaction.amount, transaction.currency)}
              </p>
              <Badge variant={getVariant()} className="mt-1">
                {transaction.status}
              </Badge>
            </div>
          </div>
          {transaction.description && (
            <p className="mt-1 text-sm text-gray-600">{transaction.description}</p>
          )}
          {transaction.exchangeDetails && (
            <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <p>
                Exchanged {transaction.exchangeDetails.fromAmount}{' '}
                {transaction.exchangeDetails.fromCurrency} to{' '}
                {transaction.exchangeDetails.toAmount} {transaction.exchangeDetails.toCurrency} at
                rate {transaction.exchangeDetails.rate.toFixed(4)}
              </p>
            </div>
          )}
          {transaction.withdrawDetails && (
            <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <p>
                Bank: {transaction.withdrawDetails.bankName} | Account:{' '}
                {transaction.withdrawDetails.accountNumber} | IFSC:{' '}
                {transaction.withdrawDetails.ifscCode}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
