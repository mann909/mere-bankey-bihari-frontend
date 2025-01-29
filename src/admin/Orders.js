import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Phone, Loader2, Mail, MapPin } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = 'https://mere-bankey-bihari-backend-production-41f5.up.railway.app';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders?.filter(order =>
    order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone.includes(searchTerm)
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div className="w-full bg-white p-4 md:p-6 rounded-lg shadow-lg">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          <Loader2 className="text-white animate-spin" size={64} />
          <p className="text-xl text-white bg-gray-600 rounded-xl py-2 px-4">It might take a while, please wait.</p>
        </div>
      )}

      <div className="mb-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search orders by name, email or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-orange-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order Details</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact Info</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Shipping</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence>
              {filteredOrders?.map((order) => (
                <React.Fragment key={order._id}>
                  <motion.tr
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="group hover:bg-orange-50/50 cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <ChevronDown
                          className={`text-orange-500 transition-transform duration-200 ${
                            expandedOrder === order._id ? 'transform rotate-180' : ''
                          }`}
                          size={20}
                        />
                        <div>
                          <p className="font-medium text-gray-800">{order.name}</p>
                          <p className="text-sm text-gray-500">Order #{order._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{order.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{order.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-600">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index}>
                            {item.name} x{item.quantity}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-orange-500">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-800">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{order.pincode}</span>
                      </div>
                    </td>
                  </motion.tr>

                  {/* Expanded Order Details */}
                  <AnimatePresence>
                    {expandedOrder === order._id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-orange-50/30"
                      >
                        <td colSpan={5} className="px-4 py-4">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                          >
                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Shipping Address</h4>
                              <p className="text-sm text-gray-600">{order.address}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Order Items</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {order.items.map((item, index) => (
                                  <div
                                    key={index}
                                    className="bg-white p-3 rounded-lg shadow-sm flex items-center space-x-3"
                                  >
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                      <span className="text-orange-500 font-medium">
                                        x{item.quantity}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-800">{item.name}</p>
                                      <p className="text-sm text-gray-500">
                                        {formatPrice(item.price * item.quantity)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        <AnimatePresence>
          {filteredOrders?.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-orange-50/30 rounded-lg shadow-sm overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{order.name}</p>
                    <p className="text-sm text-gray-500">Order #{order._id}</p>
                  </div>
                  <ChevronDown
                    className={`text-orange-500 transition-transform duration-200 ${
                      expandedOrder === order._id ? 'transform rotate-180' : ''
                    }`}
                    size={20}
                  />
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{order.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{order.phone}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index}>
                      {item.name} x{item.quantity}
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <span className="text-orange-500">
                      +{order.items.length - 2} more
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{order.pincode}</span>
                </div>
                <div className="mt-2">
                  <span className="font-medium text-gray-800">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {expandedOrder === order._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 border-t border-orange-100"
                  >
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-600">{order.address}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Order Items</h4>
                        <div className="grid grid-cols-1 gap-4">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="bg-white p-3 rounded-lg shadow-sm flex items-center space-x-3"
                            >
                              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <span className="text-orange-500 font-medium">
                                  x{item.quantity}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Orders;