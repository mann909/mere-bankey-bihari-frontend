import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import toast from "react-hot-toast";
import axios from "axios";

const BACKEND_URL = 'https://mere-bankey-bihari-backend-production-41f5.up.railway.app'
// const BACKEND_URL = 'http:///localhost:8181';
// const BACKEND_URL = 'http://192.168.1.14:8181';

// Product List Component
const ProductList = ({loading,setLoading}) => {
    // const products = [
    //   { name: "Prasadi Mala Jholi and Tulsi Mala", image:"./products/Prasadi-Mala-Jholi-and-Tulsi-Mala-scaled.jpg", price: 1 ,stock:20, },
    //   { name: "Prasadi Lalla and Dress",image:'/products/Prasadi-Lalla-and-Dress-scaled.jpg', price: 100,stock:10,  },
    //   { name: "Prasadi Charan Paduka",image:"/products/prasadi-charan-paduka-scaled.jpg", price: 299,stock:20,  },
    //   { name: "Prasadi Perfume",image:"/products/prasadi-perfume.jpg", price: 300,stock:5,  },
    //   { name: "Prasadi Coins",image:"/products/prasadi-coins.jpg", price: 250,stock:1,  },
    //   { name: "Laddu Gopal ji's Prasadi and Makeup",image:"/products/Laddu-Gopal-jis-prasadi-dress-and-makeup-scaled.jpg", price: 400,stock:100,  },
    //   { name: "Prasadi Picture",image:"/products/Prasadi-picture.jpg", price: 200,stock:9,  },
    // ];

    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(BACKEND_URL + "/products");
        console.log(response.data);
        const result = response.data
        setProducts(result.map((product) => ({...product, quantity: 0})));
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch products");
      }finally{
          setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchProducts();
    }, []);
  
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
              key={product._id}
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