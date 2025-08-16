import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiDollarSign, FiRefreshCw, FiList, FiLogOut } from 'react-icons/fi';
import { useWallet } from '../contexts/WalletContext';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useWallet();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome size={20} /> },
    { path: '/withdraw', label: 'Withdraw', icon: <FiDollarSign size={20} /> },
    { path: '/exchange', label: 'Exchange', icon: <FiRefreshCw size={20} /> },
    { path: '/transactions', label: 'Transactions', icon: <FiList size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600">Wallet App</h1>
              </div>
            </div>
            {user && (
              <div className="flex items-center">
                <span className="text-gray-500 mr-4">{user.mobileNumber}</span>
                <button
                  onClick={handleLogout}
                  className="ml-3 flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-danger-500 hover:bg-danger-600 transition-colors"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden md:block w-64 mr-6">
            <div className="bg-white rounded-card shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Menu</h2>
              </div>
              <nav className="px-3 py-3">
                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                          isActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                        {isActive && (
                          <motion.div
                            className="absolute left-0 w-1 h-full bg-primary-600 rounded-r"
                            layoutId="sidebar-indicator"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </div>
          </div>

          {/* Mobile navigation */}
          <div className="block md:hidden mb-6">
            <div className="bg-white rounded-card shadow-card overflow-hidden">
              <div className="px-2 py-3 flex overflow-x-auto">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex flex-col items-center px-4 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="mt-1">{item.label}</span>
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 w-full h-0.5 bg-primary-600 rounded-t"
                          layoutId="mobile-indicator"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
