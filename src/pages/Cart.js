import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {cartItems,updateQuantity} = useAppContext();
  const navigate = useNavigate();
  console.log(cartItems);

  // const [items, setItems] = useState(cartItems);


  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const cartVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      {/* Cart Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed right-4 lg:right-6 bottom-4 lg:bottom-6 z-40 bg-orange-500 text-white p-3 lg:p-4 rounded-full shadow-lg"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {totalItems}
            </motion.span>
          )}
        </div>
      </motion.button>

      {/* Cart Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Cart Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={cartVariants}
            className="fixed right-0 top-0 h-full w-full sm:w-[28rem] lg:w-[32rem] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Cart Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Your Cart</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                </motion.button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <AnimatePresence>
                {cartItems.map(item => (
                  <motion.div
                    key={item._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 mb-3 sm:mb-4 bg-white rounded-lg border border-gray-100"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">{item.name}</h3>
                      <p className="text-orange-500 font-semibold text-sm sm:text-base">₹{item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item._id, -1)}
                          className="p-1 rounded-full bg-orange-50 text-orange-500"
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.button>
                        <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">{item.quantity}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item._id, 1)}
                          className={item.quantity>=item.stock ? " bg-gray-100 text-gray-400 cursor-not-allowed":"p-1 rounded-full bg-orange-50 text-orange-500"}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item._id, -item.quantity)}
                          className="ml-auto p-1 rounded-full hover:bg-gray-100"
                        >
                          <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {cartItems.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 sm:py-12"
                >
                  <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-3 sm:mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base">Your cart is empty</p>
                </motion.div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 p-4 sm:p-6">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-semibold pt-2">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <motion.button
                  onClick={() => navigate('/checkout')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 sm:py-3 bg-orange-500 text-white rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                >
                  Checkout
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
                {subtotal < 50 && (
                  <p className="text-xs sm:text-sm text-gray-500 text-center mt-3 sm:mt-4">
                    Add ₹{(50 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;