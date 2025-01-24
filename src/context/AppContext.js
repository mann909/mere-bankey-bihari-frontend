import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Create the context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
    // Add your state variables here
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const [cartItems, setCartItems] = useState(() => {
        const saved = sessionStorage.getItem('existingCartItems');
        return saved ? JSON.parse(saved) : [];
    });

    const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        sessionStorage.setItem('existingCartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const emptyCart = () => {
        setCartItems([]);
    }

    const alreadyExistsInCart = (id) => {
        return cartItems.find(item => item.id === id);
    };

    const addToCart = (product) => {
        const existing = cartItems.find(item => item.id === product.id);
        if (existing) {
            updateQuantity(product.id, 1);
        } else {
            toast.success('Product added to cart');
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        toast.error('Product removed from cart');
        setCartItems(cartItems.filter(item => item.id !== id));
    }

    const updateQuantity = (id, change) => {
        setCartItems(cartItems.map(item => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + change);
            return { ...item, quantity: newQuantity };
          }
          return item;
        }).filter(item => item.quantity > 0));
      };

    // Add your methods here
    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    // Create an object with all the values you want to share
    const value = {
        isAuthenticated,
        user,
        loading,
        cartItems,
        totalAmount,
        setLoading,
        login,
        logout,
        updateQuantity,
        alreadyExistsInCart,
        addToCart,
        removeFromCart,
        emptyCart,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Create a custom hook for using this context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

// Export the context if needed
export default AppContext;