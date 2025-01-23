import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import MobileMenu from "../components/MobileMenu";
import ProductList from "../components/ProductList";
import Loader from "../components/Loader";


// Main App Component
const Home = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hasLoaderAppeared = sessionStorage.getItem("hasLoaderAppeared") || false;


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
      sessionStorage.setItem("hasLoaderAppeared", true);
      },
        1000
      );
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <AnimatePresence>
        {!hasLoaderAppeared && showLoader && <Loader />}
      </AnimatePresence>
      
      <div className="relative">
        <Header toggleMenu={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />
        <MobileMenu isOpen={isMenuOpen} />
        <ProductList />
      </div>
    </div>
  );
};

export default Home;