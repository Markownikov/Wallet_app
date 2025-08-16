import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSmartphone, FiLock, FiArrowRight, FiDollarSign, 
  FiRefreshCw, FiCreditCard, FiShield, FiGlobe 
} from 'react-icons/fi';
import { useWallet } from '../contexts/WalletContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent, CardHeader, CardFooter } from '../components/ui/Card';

const Login: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const navigate = useNavigate();
  const { login, verify } = useWallet();
  
  // App features for the carousel
  const features = [
    { 
      icon: <FiDollarSign size={24} className="text-indigo-500" />, 
      title: 'Multi-Currency Wallet', 
      description: 'Manage funds in INR, USD, EUR, and GBP all in one place.' 
    },
    { 
      icon: <FiRefreshCw size={24} className="text-green-500" />, 
      title: 'Currency Exchange', 
      description: 'Convert between currencies with real-time exchange rates.' 
    },
    { 
      icon: <FiCreditCard size={24} className="text-blue-500" />, 
      title: 'Easy Transfers', 
      description: 'Add and withdraw funds seamlessly to your bank account.' 
    },
    { 
      icon: <FiShield size={24} className="text-purple-500" />, 
      title: 'Secure Authentication', 
      description: 'Your transactions are protected with OTP verification.' 
    }
  ];
  
  // Auto rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation for Indian mobile numbers
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      setIsLoading(false);
      return;
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      // In a real app, this would send an actual OTP to the phone
      login(mobileNumber);
      setShowOtpInput(true);
      setError('');
      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (otp.length !== 4) {
      setError('OTP must be 4 digits');
      setIsLoading(false);
      return;
    }
    
    // Simulate API verification with timeout
    setTimeout(() => {
      // Use the dummy OTP (1234)
      const isVerified = verify(otp);
      
      if (isVerified) {
        navigate('/dashboard');
      } else {
        setError('Invalid OTP. Try 1234');
        setIsLoading(false);
      }
    }, 1000);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-indigo-300/10 to-purple-300/10"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: Math.random() * 20 + 10,
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="max-w-md w-full z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div 
            className="flex justify-center items-center mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          >
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <FiDollarSign className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            Wallet App
          </motion.h2>
          
          <motion.p 
            className="mt-2 text-sm text-gray-600 max-w-xs mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Manage your money across multiple currencies with ease and security
          </motion.p>
          
          {/* Feature Carousel */}
          <div className="mt-6 relative">
            {/* Feature content with fixed height */}
            <div className="h-24 mb-4">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentFeature}
                  className="absolute inset-0 flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    {features[currentFeature].icon}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">{features[currentFeature].title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{features[currentFeature].description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Dots indicator - separated from content */}
            <div className="flex justify-center mt-2 space-x-2">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentFeature(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentFeature ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="shadow-xl border-t border-purple-100">
            <CardHeader className="relative">
              <motion.div
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-3 shadow-lg"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                {!showOtpInput ? 
                  <FiSmartphone className="h-6 w-6 text-white" /> : 
                  <FiLock className="h-6 w-6 text-white" />
                }
              </motion.div>
              
              <h3 className="text-lg font-bold text-center text-gray-900 pt-2">
                {!showOtpInput ? 'Login with Mobile' : 'Enter OTP'}
              </h3>
              <p className="text-sm text-center text-gray-500 mt-1">
                {!showOtpInput ? 
                  'Enter your mobile number to continue' : 
                  'Check your phone for verification code'
                }
              </p>
            </CardHeader>
            
            <CardContent className="pt-4">
              {!showOtpInput ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div 
                    className="relative" 
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <Input
                      label="Mobile Number"
                      type="tel"
                      id="mobile"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                      required
                      icon={<FiSmartphone className="text-indigo-500" />}
                      error={error}
                      className="focus:ring-indigo-500 placeholder:text-gray-400 text-base"
                    />
                    <p className="mt-1 text-xs text-gray-500">Please enter your 10-digit mobile number</p>
                    
                    {/* Tooltip */}
                    {showTooltip && (
                      <div className="absolute right-0 top-10 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-64">
                        Enter any 10 digit mobile number starting with 6-9
                        <div className="absolute top-0 right-4 transform -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      fullWidth 
                      isLoading={isLoading}
                      icon={<FiArrowRight />}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      Send OTP
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <div className="bg-indigo-50 rounded-lg p-3 mb-4 flex items-center text-indigo-700 text-sm">
                      <FiSmartphone className="mr-2 flex-shrink-0" />
                      <p>
                        OTP sent to <span className="font-medium">{mobileNumber}</span>{' '}
                        <button 
                          type="button" 
                          onClick={() => setShowOtpInput(false)} 
                          className="text-indigo-700 underline hover:text-indigo-800 ml-1 focus:outline-none"
                        >
                          Change
                        </button>
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Input
                        label="One-Time Password"
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="Enter 4-digit OTP"
                        maxLength={4}
                        required
                        icon={<FiLock className="text-indigo-500" />}
                        error={error}
                        className="text-center tracking-wider"
                      />
                      
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                        <p className="text-xs text-blue-700 flex items-center">
                          <FiShield className="mr-1" />
                          For demo, use <span className="font-bold mx-1">1234</span> as the OTP
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      fullWidth
                      isLoading={isLoading}
                      icon={<FiArrowRight />}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      Verify & Continue
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
            
            <CardFooter className="border-t border-gray-100 pt-4 pb-6">
              <div className="text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center">
                  <FiGlobe className="mr-1" />
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-indigo-600 hover:underline mx-1">Terms of Service</a> 
                  and{' '}
                  <a href="#" className="text-indigo-600 hover:underline mx-1">Privacy Policy</a>
                </p>
              </div>
            </CardFooter>
          </Card>
          
          {/* Currency cards decoration */}
          <motion.div 
            className="mt-8 flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="h-8 w-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md transform rotate-12">
              <span className="text-white text-xs">$</span>
            </div>
            <div className="h-8 w-8 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md transform -rotate-6">
              <span className="text-white text-xs">€</span>
            </div>
            <div className="h-8 w-8 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-xs">₹</span>
            </div>
            <div className="h-8 w-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-md transform rotate-6">
              <span className="text-white text-xs">£</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Bottom waves decoration */}
      <div className="absolute bottom-0 left-0 w-full z-0 overflow-hidden leading-none">
        <svg 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-12 rotate-180"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="fill-indigo-500"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="fill-indigo-500"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-indigo-500"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Login;
