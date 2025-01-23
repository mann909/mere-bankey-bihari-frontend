import { motion, AnimatePresence } from "framer-motion";

// Mobile Menu Component
const MobileMenu = ({ isOpen }) => {

    const links =["Home", "Products", "About","Online Prasad Seva","Gaushala","Places To Visit","Gallery","Contact Us","Donate"];

    const menuVariants = {
      closed: {
        opacity: 0,
        y: -20,
        transition: {
          staggerChildren: 0.05,
          staggerDirection: -1
        }
      },
      open: {
        opacity: 1,
        y: 0,
        transition: {
          staggerChildren: 0.07,
          delayChildren: 0.2
        }
      }
    };

    const itemVariants = {
    closed: { opacity: 0, x: -50 },
    open: { opacity: 1, x: 0 }
    };

    return (
    <AnimatePresence>
        {isOpen && (
        <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg z-30"
        >
            {links.map((item) => (
            <motion.a
                key={item}
                href="#"
                variants={itemVariants}
                className="block px-8 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                whileTap={{ scale: 0.95 }}
            >
                {item}
            </motion.a>
            ))}
        </motion.div>
        )}
    </AnimatePresence>
    );
};


export default MobileMenu;