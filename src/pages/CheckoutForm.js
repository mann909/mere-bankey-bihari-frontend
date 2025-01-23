import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check, MapPin, Phone, Mail, User } from 'lucide-react';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = () => {

  const {cartItems} = useAppContext();
  const navigate = useNavigate();
  
  const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.phone) newErrors.phone = 'Phone is required';
      else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    } else if (currentStep === 2) {
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.pincode) newErrors.pincode = 'Pincode is required';
      else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const createOrder = async () => {
    try { 
      const { data }= await axios.post("http://localhost:8181/capture-payment");
      console.log(data)
      loadRazorpay(data);
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
    }
  };

  const loadRazorpay = (orderData) => {
    const options = {
      key: "rzp_test_1UDz6aRR419fU5",
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Bankey Bihari",
      image:"./images/logo.png",
      description: "Payment for bankey Bihari",
      order_id: orderData.id,
      handler: function (response) {
        alert("Your Payment for the product of Prasadi was successful!");
        console.log("Payment successful: ", response);
        navigate('/');
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        userId: "678b3e865edf34bfee3d382c",
        productId: "678b3e5155b4a781f1b0911c",
        productType: "Material",
      },
      theme: {
        color: "#F37254"
      }
    };

    const rzp = window.Razorpay(options);
    rzp.open();
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step === 2) {
        createOrder();
      } else {
        setStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0,
      x: -50,
      transition: { duration: 0.2 }
    }
  };

  const progressBarWidth = `${(step / 2) * 100}%`;

  const InputField = React.memo(({ icon: Icon, ...props }) => (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Icon className="w-5 h-5" />
      </div>
      <input
        {...props}
        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
          errors[props.name] ? 'border-red-500' : 'border-gray-200'
        }`}
      />
      {errors[props.name] && (
        <p className="text-red-500 text-sm mt-1">{errors[props.name]}</p>
      )}
    </div>
  ));

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl"
        layoutId="checkout-container"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Checkout</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={navigate}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6 text-gray-500" />
            </motion.button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-orange-500"
                initial={{ width: 0 }}
                animate={{ width: progressBarWidth }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={step >= 1 ? 'text-orange-500' : 'text-gray-400'}>Personal Info</span>
              <span className={step >= 2 ? 'text-orange-500' : 'text-gray-400'}>Shipping Details</span>
            </div>
          </div>
        </div>

        {/* Form Steps */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="personal"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    icon={User}
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={User}
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                <InputField
                  icon={Mail}
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
                <InputField
                  icon={Phone}
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="shipping"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <InputField
                  icon={MapPin}
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    icon={MapPin}
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={MapPin}
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <InputField
                  icon={MapPin}
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />

                <div className="bg-orange-50 p-4 rounded-lg mt-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
                  <div className="space-y-2">
                    {cartItems?.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-orange-200 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6">
          <div className="flex justify-between">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBack}
                className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="ml-auto px-6 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 hover:bg-orange-600"
            >
              {step === 2 ? (
                <>
                  Proceed to Pay
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CheckoutForm;