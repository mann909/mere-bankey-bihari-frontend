import { motion } from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";

// Header Component
const Header = ({ toggleMenu, isMenuOpen }) => {
  const links =["Home", "Products", "About","Online Prasad Seva","Gaushala","Places To Visit","Gallery","Contact Us","Donate"];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="sticky top-0 z-40 bg-white shadow-lg backdrop-blur-md bg-opacity-90"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-24">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-orange-500 font-bold text-md"
          >
            <img src="./images/logo.png" alt="merebankebihariji" className="h-10 w-10 md:h-15 md:w-15 xl:h-20 xl:w-20" />
          </motion.div>

          <nav className="hidden md:flex space-x-8">
            {links.map((item) => (
              <motion.a
                key={item}
                href="#"
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-700 cursor-pointer relative"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </motion.div> */}
            
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                className="text-gray-700"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;