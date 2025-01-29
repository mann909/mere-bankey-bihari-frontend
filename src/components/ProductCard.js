import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ _id, name, price, image ,stock }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    alreadyExistsInCart,
    addToCart,
    removeFromCart,
    updateQuantity
  } = useAppContext();

  const existsInCart = alreadyExistsInCart(_id);
  const quantity = existsInCart ? existsInCart.quantity : 0;
  const isOutOfStock = stock-quantity <= 0;

  const handleAddRemoveCart = () => {
    if (existsInCart) {
    removeFromCart(_id);
    } else {
    addToCart({ _id, name, price,stock, image, quantity: 1 });
    }
  };

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -10 }}
    onHoverStart={() => setIsHovered(true)}
    onHoverEnd={() => setIsHovered(false)}
    className="bg-white rounded-xl shadow-lg overflow-h_idden transform transition-all duration-300"
    >
    {/* Image and product info section remains the same */}
    <div className="relative p-4">
      <div className="relative h-[20rem] w-full bg-gray-100 rounded-lg overflow-h_idden">
      <motion.img
        src={image}
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full bg-gray-200"
      />
      </div>
      
      <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-orange-500 font-bold text-xl mt-2">₹{price}</p>
      {stock<=10 &&  <p className="text-red-500 font-semibold text-md mt-2">{stock <=0 ? "Sold Out": `Only ${stock} left in stock`}</p>}
      
      <motion.div 
        className="flex items-center justify-between mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-3">
        <motion.button
          whileHover={{ scale: existsInCart ? 1.1 : 1 }}
          whileTap={{ scale: existsInCart ? 0.9 : 1 }}
          onClick={() => {
          if (existsInCart) {
            updateQuantity(_id, -1);
          }
          }}
          className={`p-2 rounded-full ${
          existsInCart 
            ? "bg-orange-100 text-orange-500 hover:bg-orange-200" 
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
          } transition-colors`}
          disabled={!existsInCart}
        >
          <Minus className="w-4 h-4" />
        </motion.button>
        
        <span className="font-medium text-gray-700 w-8 text-center">
          {quantity}
        </span>
        
        <motion.button
          whileHover={{ scale: existsInCart ? 1.1 : 1 }}
          whileTap={{ scale: existsInCart ? 0.9 : 1 }}
          onClick={() => {
          if (existsInCart) {
            updateQuantity(_id, 1);
          }
          }}
          className={`p-2 rounded-full ${
          existsInCart && !isOutOfStock
            ? "bg-orange-100 text-orange-500 hover:bg-orange-200" 
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
          } transition-colors`}
          disabled={!existsInCart || isOutOfStock}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
        </div>
        
        <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAddRemoveCart}
        disabled={stock<=0 || (!existsInCart && isOutOfStock)}
        className={`px-4 py-2 ${
          stock<=0 ?
          "bg-gray-800 text-gray-200 cursor-not-allowed":
          existsInCart
          ? "bg-red-500 hover:bg-red-600"
          : "bg-orange-500 hover:bg-orange-600"
        } text-white rounded-lg transition-colors`}
        >
        {stock<=0 ? "Not Available" :existsInCart ? "Remove from Cart" : "Add to Cart"}
        </motion.button>
      </motion.div>
      </div>
    </div>
    </motion.div>
  );
};

export default ProductCard;