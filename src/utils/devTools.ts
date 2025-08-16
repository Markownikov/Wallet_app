// This file contains utility functions for development/testing purposes

/**
 * Reset all wallet data in localStorage to defaults
 * Only use this in development to reset the app state
 */
export const resetWalletData = () => {
  localStorage.removeItem('wallet_user');
  localStorage.removeItem('wallet_balance');
  localStorage.removeItem('wallet_transactions');
  console.log('Wallet data has been reset. Refresh the page to see changes.');
};

/**
 * Set custom balance values (useful for testing)
 */
export const setCustomBalances = (inr = 1000, usd = 0, eur = 10, gbp = 15) => {
  const balance = {
    INR: inr,
    USD: usd,
    EUR: eur,
    GBP: gbp
  };
  localStorage.setItem('wallet_balance', JSON.stringify(balance));
  console.log('Custom balances set:', balance);
  console.log('Refresh the page to see changes.');
};
