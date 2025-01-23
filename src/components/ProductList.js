import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

// Product List Component
const ProductList = () => {
    const products = [
      { id: 1, name: "Prasadi Mala Jholi and Tulsi Mala", image:"./products/Prasadi-Mala-Jholi-and-Tulsi-Mala-scaled.jpg", price: 1 , quantity: 0},
      { id: 2, name: "Prasadi Lalla and Dress",image:'/products/Prasadi-Lalla-and-Dress-scaled.jpg', price: 100, quantity: 0 },
      { id: 3, name: "Prasadi Charan Paduka",image:"/products/prasadi-charan-paduka-scaled.jpg", price: 299, quantity: 0 },
      { id: 4, name: "Prasadi Perfume",image:"/products/prasadi-perfume.jpg", price: 300, quantity: 0 },
      { id: 5, name: "Prasadi Coins",image:"/products/prasadi-coins.jpg", price: 250, quantity: 0 },
      { id: 6, name: "Laddu Gopal ji's Prasadi and Makeup",image:"/products/Laddu-Gopal-jis-prasadi-dress-and-makeup-scaled.jpg", price: 400, quantity: 0 },
      { id: 7, name: "Prasadi Picture",image:"/products/Prasadi-picture.jpg", price: 200, quantity: 0 },
    ];
  
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  };
  
  export default ProductList;