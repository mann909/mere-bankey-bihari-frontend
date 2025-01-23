import { motion } from "framer-motion";

// Initial Loader Component
const Loader = () => {
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-orange-200 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.5,
            ease: "easeOut"
          }}
        >
          <img
            src="./images/KrishnaMobile.png"
            alt="Loading..."
            className="md:hidden h-screen w-screen object-cover"
          />

          <img
            src="https://merebankeybihari.com/wp-content/uploads/2022/10/WhatsApp-Image-2022-10-27-at-6.35.28-AM.jpeg"
            alt="Loading..."
            className="hidden md:block h-screen w-screen object-cover"
          />
        </motion.div>
      </motion.div>
    );
  };


  export default Loader;