import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/hooks';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Eye, EyeOff, Mail, Lock, Shield, CheckCircle, AlertCircle, 
  User, Phone, MapPin, Calendar, Building, ArrowRight, 
  Chrome, KeyRound, Globe, Users
} from 'lucide-react';

const Register = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    
    // Address Information
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Account Security
    password: '',
    confirmPassword: '',
    
    // Optional Information
    occupation: '',
    income: '',
    category: '',
    
    // Agreements
    termsAccepted: false,
    privacyAccepted: false,
    newsletterOptIn: false
  });

  // Animation effect
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const steps = [
    { 
      id: 1, 
      title: 'Personal Info', 
      description: 'Basic information',
      icon: User 
    },
    { 
      id: 2, 
      title: 'Address', 
      description: 'Location details',
      icon: MapPin 
    },
    { 
      id: 3, 
      title: 'Security', 
      description: 'Account security',
      icon: Shield 
    },
    { 
      id: 4, 
      title: 'Preferences', 
      description: 'Additional options',
      icon: Users 
    }
  ];

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    }

    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.pincode.trim()) {
        newErrors.pincode = 'PIN code is required';
      } else if (!/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = 'Please enter a valid 6-digit PIN code';
      }
    }

    if (step === 3) {
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, and number';
      }
      
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 4) {
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
      if (!formData.privacyAccepted) newErrors.privacyAccepted = 'You must accept the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(4)) return;
    
    try {
      // Format the data to match backend requirements
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        occupation: formData.occupation || 'Not specified',
        annualIncome: formData.income ? parseInt(formData.income) || 0 : 0,
        category: formData.category || 'general'
      };
      
      await register(registrationData);
      toast({
        title: t('auth.registrationSuccessful'),
        description: "Welcome to Saral Seva! Please verify your email.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message || 'Registration failed. Please try again.',
        variant: "destructive",
      });
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      toast({
        title: `${provider} Registration`,
        description: "Feature coming soon!",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message || `${provider} registration failed.`,
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 ${
                      errors.firstName ? 'border-red-300' : 'border-gray-200'
                    } rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-gray-50/50 focus:bg-white`}
                    placeholder="Enter first name"
                  />
                </div>
                {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 ${
                      errors.lastName ? 'border-red-300' : 'border-gray-200'
                    } rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-gray-50/50 focus:bg-white`}
                    placeholder="Enter last name"
                  />
                </div>
                {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 ${
                    errors.email ? 'border-red-300' : 'border-gray-200'
                  } rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-gray-50/50 focus:bg-white`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 ${
                    errors.phone ? 'border-red-300' : 'border-gray-200'
                  } rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-gray-50/50 focus:bg-white`}
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 ${
                      errors.dateOfBirth ? 'border-red-300' : 'border-gray-200'
                    } rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-gray-50/50 focus:bg-white`}
                  />
                </div>
                {errors.dateOfBirth && <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 ${
                    errors.gender ? 'border-red-300' : 'border-gray-200'
                  } rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-gray-50/50 focus:bg-white`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full pl-10 pr-4 py-3 border-2 ${
                    errors.address ? 'border-red-300' : 'border-gray-200'
                  } rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-gray-50/50 focus:bg-white resize-none`}
                  placeholder="Enter your full address"
                />
              </div>
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 ${
                    errors.city ? 'border-red-300' : 'border-gray-200'
                  } rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-gray-50/50 focus:bg-white`}
                  placeholder="Enter city"
                />
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 ${
                    errors.state ? 'border-red-300' : 'border-gray-200'
                  } rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-gray-50/50 focus:bg-white`}
                >
                  <option value="">Select state</option>
                  <option value="delhi">Delhi</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="uttar-pradesh">Uttar Pradesh</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="tamil-nadu">Tamil Nadu</option>
                  <option value="gujarat">Gujarat</option>
                  <option value="west-bengal">West Bengal</option>
                  <option value="rajasthan">Rajasthan</option>
                  <option value="madhya-pradesh">Madhya Pradesh</option>
                  <option value="andhra-pradesh">Andhra Pradesh</option>
                  <option value="telangana">Telangana</option>
                  <option value="other">Other</option>
                </select>
                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">PIN Code</label>
              <input
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 ${
                  errors.pincode ? 'border-red-300' : 'border-gray-200'
                } rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-gray-50/50 focus:bg-white`}
                placeholder="Enter 6-digit PIN code"
              />
              {errors.pincode && <p className="text-red-600 text-sm mt-1">{errors.pincode}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border-2 ${
                    errors.password ? 'border-red-300' : 'border-gray-200'
                  } rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-gray-50/50 focus:bg-white`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              <div className="mt-2 text-xs text-gray-600">
                Password must contain uppercase, lowercase, and number (minimum 8 characters)
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border-2 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                  } rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-gray-50/50 focus:bg-white`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Password Security Tips:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use a mix of uppercase and lowercase letters</li>
                <li>• Include numbers and special characters</li>
                <li>• Make it at least 8 characters long</li>
                <li>• Avoid common words or personal information</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Information</h3>
              <p className="text-gray-600 text-sm">These details help us provide better services (optional)</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
                <div className="relative group">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    name="occupation"
                    type="text"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-gray-50/50 focus:bg-white"
                    placeholder="Your occupation"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Income</label>
                <select
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-gray-50/50 focus:bg-white"
                >
                  <option value="">Select income range</option>
                  <option value="250000">Below ₹2.5 Lakh</option>
                  <option value="500000">₹2.5 - ₹5 Lakh</option>
                  <option value="1000000">₹5 - ₹10 Lakh</option>
                  <option value="2500000">₹10 - ₹25 Lakh</option>
                  <option value="5000000">Above ₹25 Lakh</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-gray-50/50 focus:bg-white"
              >
                <option value="">Select category</option>
                <option value="general">General</option>
                <option value="obc">OBC</option>
                <option value="sc">SC</option>
                <option value="st">ST</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-4 bg-gray-50 p-6 rounded-xl">
              <div className="flex items-start space-x-3">
                <input
                  id="termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded mt-1"
                />
                <label htmlFor="termsAccepted" className="text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-indigo-600 hover:text-indigo-800 underline">
                    Terms and Conditions
                  </Link>
                </label>
              </div>
              {errors.termsAccepted && <p className="text-red-600 text-sm">{errors.termsAccepted}</p>}

              <div className="flex items-start space-x-3">
                <input
                  id="privacyAccepted"
                  name="privacyAccepted"
                  type="checkbox"
                  checked={formData.privacyAccepted}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded mt-1"
                />
                <label htmlFor="privacyAccepted" className="text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/privacy" className="text-indigo-600 hover:text-indigo-800 underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.privacyAccepted && <p className="text-red-600 text-sm">{errors.privacyAccepted}</p>}

              <div className="flex items-start space-x-3">
                <input
                  id="newsletterOptIn"
                  name="newsletterOptIn"
                  type="checkbox"
                  checked={formData.newsletterOptIn}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded mt-1"
                />
                <label htmlFor="newsletterOptIn" className="text-sm text-gray-700">
                  Send me updates about new schemes and services (optional)
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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

      <div className={`w-full max-w-2xl relative z-10 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className={`text-center p-8 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Join Saral Seva</h1>
            <p className="text-blue-100">Create your government services account</p>
          </div>

          {/* Progress Steps */}
          <div className={`px-8 py-6 bg-white/60 backdrop-blur-sm transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    currentStep >= step.id 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-full h-1 mx-4 transition-all duration-300 ${
                      currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3">
              {steps.map((step) => (
                <div key={step.id} className="text-center flex-1">
                  <div className={`text-xs font-medium transition-colors duration-300 ${
                    currentStep >= step.id ? 'text-indigo-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Registration (Show only on step 1) */}
          {currentStep === 1 && (
            <div className={`px-8 py-6 transform transition-all duration-1000 delay-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}>
              <div className="space-y-4 mb-6">
                <button
                  onClick={() => handleSocialLogin('DigiLocker')}
                  disabled={isLoading}
                  className="w-full group flex items-center justify-center px-6 py-4 border border-orange-200 rounded-xl text-orange-700 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg"
                >
                  <Shield className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                  Register with DigiLocker
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                </button>
                
                <button
                  onClick={() => handleSocialLogin('Google')}
                  disabled={isLoading}
                  className="w-full group flex items-center justify-center px-6 py-4 border border-gray-200 rounded-xl text-gray-700 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg"
                >
                  <Chrome className="w-5 h-5 mr-3" />
                  Register with Google
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or register with email</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={currentStep === 4 ? handleSubmit : (e) => e.preventDefault()} className="p-8">
            <div className={`mb-8 transform transition-all duration-1000 delay-900 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}>
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className={`flex justify-between transform transition-all duration-1000 delay-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                >
                  Previous
                </button>
              )}
              
              <div className="flex-1"></div>
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Sign In Link */}
          <div className={`text-center pb-8 transform transition-all duration-1000 delay-1200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <p className="text-sm text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200 hover:underline">
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className={`mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl transform transition-all duration-1000 delay-1300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`}>
          <div className="flex items-start">
            <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 mr-4 flex-shrink-0 animate-pulse" />
            <div className="text-sm text-green-800">
              <p className="font-semibold mb-2">🔒 Your information is protected</p>
              <p className="text-green-700 leading-relaxed">
                All personal information is encrypted and stored securely according to government data protection standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;