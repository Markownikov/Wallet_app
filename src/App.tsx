import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider, useWallet } from './contexts/WalletContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import ExchangeCurrency from './pages/ExchangeCurrency';
import Withdraw from './pages/Withdraw';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useWallet();
  
  if (!user || !user.isVerified) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/exchange" 
        element={
          <ProtectedRoute>
            <ExchangeCurrency />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/withdraw" 
        element={
          <ProtectedRoute>
            <Withdraw />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <WalletProvider>
        <AppRoutes />
      </WalletProvider>
    </Router>
  );
}

export default App;
