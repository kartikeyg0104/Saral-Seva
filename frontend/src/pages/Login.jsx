import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/hooks';
import { useLanguage } from '../contexts/LanguageContext';
import { Eye, EyeOff, Mail, Lock, Shield, CheckCircle, AlertCircle, ArrowRight, Chrome, KeyRound } from 'lucide-react';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  // Animation effect
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await login({ 
        identifier: formData.email, 
        password: formData.password,
        loginMethod: 'email'
      });
      toast({
        title: t('auth.loginSuccessful'),
        description: "Redirecting to dashboard...",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message || 'Login failed. Please try again.',
        variant: "destructive",
      });
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider) => {
    try {
      // Implement social login logic here
      toast({
        title: `${provider} Login`,
        description: "Feature coming soon!",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message || `${provider} login failed.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-3/4 -right-20 w-96 h-96 bg-gradient-to-l from-purple-300 to-pink-300 rounded-full opacity-20 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full opacity-10 animate-pulse"></div>
      </div>

      <div className={`w-full max-w-md relative z-10 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header with Animation */}
          <div className={`text-center mb-8 transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-glow">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              {t('common.welcome')}
            </h1>
            <p className="text-gray-600">Sign in to your Saral Seva account</p>
          </div>

          {/* Social Login Buttons with Hover Animations */}
          <div className={`space-y-4 mb-8 transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <button
              onClick={() => handleSocialLogin('DigiLocker')}
              disabled={isLoading}
              className="w-full group flex items-center justify-center px-6 py-4 border border-orange-200 rounded-xl text-orange-700 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg"
            >
              <Shield className="w-5 h-5 mr-3 group-hover:animate-pulse" />
              Continue with DigiLocker
              <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
            </button>
            
            <button
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className="w-full group flex items-center justify-center px-6 py-4 border border-gray-200 rounded-xl text-gray-700 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg"
            >
              <Chrome className="w-5 h-5 mr-3" />
              Continue with Google
              <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
            </button>
          </div>

          {/* Animated Divider */}
          <div className={`relative mb-8 transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Login Form with Staggered Animation */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className={`transform transition-all duration-1000 delay-800 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 transition-colors duration-300 ${
                    formData.email ? 'text-indigo-500' : 'text-gray-400'
                  } group-focus-within:text-indigo-500`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-12 pr-4 py-4 border-2 ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                  } rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 bg-gray-50/50 focus:bg-white`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 animate-bounce" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 animate-slideIn">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className={`transform transition-all duration-1000 delay-900 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors duration-300 ${
                    formData.password ? 'text-indigo-500' : 'text-gray-400'
                  } group-focus-within:text-indigo-500`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-12 pr-12 py-4 border-2 ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                  } rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 bg-gray-50/50 focus:bg-white`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 animate-slideIn">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className={`flex items-center justify-between transform transition-all duration-1000 delay-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}>
              <div className="flex items-center group">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all duration-200"
                />
                <label htmlFor="rememberMe" className="ml-3 block text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200 hover:underline">
                  {t('auth.forgotPassword')}?
                </Link>
              </div>
            </div>

            {/* Submit Button with Advanced Animation */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full group relative overflow-hidden flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 animate-glow transform transition-all duration-1000 delay-1100 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-all duration-700"></div>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Signing in...
                </div>
              ) : (
                <span className="relative z-10">{t('auth.login')}</span>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className={`mt-8 text-center transform transition-all duration-1000 delay-1200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <p className="text-sm text-gray-600">
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200 hover:underline">
                {t('auth.createAccount')}
              </Link>
            </p>
          </div>

          {/* Enhanced Security Notice */}
          <div className={`mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl transform transition-all duration-1000 delay-1300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 mr-4 flex-shrink-0 animate-pulse" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-2">🔒 Your data is secure</p>
                <p className="text-green-700 leading-relaxed">
                  We use industry-standard encryption and multi-factor authentication to protect your personal information and government documents.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Trust Indicators */}
        <div className={`flex justify-center space-x-8 mt-8 transform transition-all duration-1000 delay-1400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`}>
          <div className="text-center group">
            <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-xs text-gray-600 mt-2">SSL Secured</p>
          </div>
          <div className="text-center group">
            <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-xs text-gray-600 mt-2">Gov Verified</p>
          </div>
          <div className="text-center group">
            <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
              <KeyRound className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600 mt-2">2FA Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;