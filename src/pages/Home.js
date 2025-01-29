import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import MobileMenu from "../components/MobileMenu";
import ProductList from "../components/ProductList";
import Loader from "../components/Loader";
import { Loader2 } from "lucide-react";


// Main App Component
const Home = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hasLoaderAppeared = sessionStorage.getItem("hasLoaderAppeared") || false;
  const [loading, setLoading] = useState(false);


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
        {/* Loader */}
        {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
                <Loader2 className="text-white animate-spin" size={64} />
                <p className="text-xl text-white bg-gray-600 rounded-xl py-2 px-4">It might take a while , please wait.</p>
            </div>
        )}
        <Header toggleMenu={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />
        <MobileMenu isOpen={isMenuOpen} />
        <ProductList loading={loading} setLoading={setLoading}/>
      </div>
    </div>
  );
};

export default Home;