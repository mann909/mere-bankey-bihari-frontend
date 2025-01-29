import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Package,
  ShoppingCart,
  Plus,
  Trash,
  Pencil,
  X,
  Loader2,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Orders from "./Orders";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = 'https://mere-bankey-bihari-backend-production-41f5.up.railway.app'
// const BACKEND_URL = 'http:///localhost:8181';
// const BACKEND_URL = 'http://192.168.1.14:8181';

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState(sessionStorage.getItem('activeTab')  ||"products");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId , setConfirmDeleteId] = useState(null);
  const {isAdminLoggedIn, setIsAdminLoggedIn} = useAppContext();
  const navigate = useNavigate();

  if(!isAdminLoggedIn){
    navigate('/login')
    }


  useEffect(()=>{
    sessionStorage.setItem('activeTab',activeTab);
  },[activeTab])

  const initialProductState = {
    name: "",
    price: "",
    stock: "",
    image: "",
    imagePreview: "",
  };

  const [newProduct, setNewProduct] = useState(initialProductState);

  // Sample product data
  //   const [products, setProducts] = useState([
  //     { id: 1, name: "Prasadi Mala Jholi and Tulsi Mala", image:"./products/Prasadi-Mala-Jholi-and-Tulsi-Mala-scaled.jpg", price: 1 , stock: 100},
  //     { id: 2, name: "Prasadi Lalla and Dress",image:'/products/Prasadi-Lalla-and-Dress-scaled.jpg', price: 100, stock: 100 },
  //     { id: 3, name: "Prasadi Charan Paduka",image:"/products/prasadi-charan-paduka-scaled.jpg", price: 299, stock: 100 },
  //     { id: 4, name: "Prasadi Perfume",image:"/products/prasadi-perfume.jpg", price: 300, stock: 100 },
  //     { id: 5, name: "Prasadi Coins",image:"/products/prasadi-coins.jpg", price: 250, stock: 100 },
  //     { id: 6, name: "Laddu Gopal ji's Prasadi and Makeup",image:"/products/Laddu-Gopal-jis-prasadi-dress-and-makeup-scaled.jpg", price: 400, stock: 100 },
  //     { id: 7, name: "Prasadi Picture",image:"/products/Prasadi-picture.jpg", price: 200, stock: 100 },
  //   ]);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BACKEND_URL + "/products");
      console.log(response.data);
      setProducts(response.data);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingProduct) {
          setEditingProduct({
            ...editingProduct,
            image: file,
            imagePreview: reader.result,
          });
        } else {
          setNewProduct({
            ...newProduct,
            image: file,
            imagePreview: reader.result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEditBackend = async (product, isEditing = false) => {
    setLoading(true);
    const endpoint = isEditing
      ? "/edit-product/" + product._id
      : "/add-product";
    try {
      console.log(product);
      console.log(product.name);
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("imageUrl", product.image);

      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(BACKEND_URL + endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      return false;
    }finally{
        setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
        const response = await axios.delete(BACKEND_URL + "/delete-product/" + id);
        console.log(response.data);
        setProducts(products.filter((p) => p._id !== id));
        toast.success("Product deleted successfully");
    }
    catch(err){
        console.log(err);
        toast.error("Failed to delete product");
    }finally{
        setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      const isOk = await handleAddEditBackend(editingProduct, true);
      if (isOk) {
        setProducts(
          products.map((p) => (p._id === editingProduct._id ? isOk : p))
        );
      } else {
        toast.error("Failed to edit product");
      }
    } else {
        if(!newProduct.image){
            toast.error("Please upload an image");
            return ;
        }
      const isOk = await handleAddEditBackend(newProduct, false);

      console.log("While adding products : ", isOk);
      if (isOk) {
        setProducts([...products, isOk]);
      } else {
        toast.error("Failed to add product");
      }
    }
    setNewProduct(initialProductState);
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      imagePreview: product.image,
    });
    setIsModalOpen(true);
  };

  const CustomCard = ({ children }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      {children}
    </motion.div>
  );

  const SidebarLink = ({ icon: Icon, text, isActive, onClick }) => (
    <motion.button
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`w-full flex items-center space-x-2 p-4 transition-all duration-200 hover:bg-orange-50 
        ${isActive ? "bg-orange-100 text-orange-500" : "text-gray-600"}`}
    >
      <Icon size={20} />
      <span className="font-medium">{text}</span>
      {isActive && <motion.div className="ml-auto text-orange-500" />}
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-orange-50 rounded-lg transition-colors duration-200"
        >
          <Menu size={24} />
        </motion.button>
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Fixed Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : -256,
        }}
        className={`
          fixed top-0 left-0 h-full bg-white w-64 shadow-lg z-50
          lg:transform-none lg:translate-x-0
        `}
      >
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>

        <nav className="mt-6">
          <SidebarLink
            icon={Package}
            text="Products"
            isActive={activeTab === "products"}
            onClick={() => {setActiveTab("products"); if(window.innerWidth < 1024)setIsSidebarOpen(false)}}
          />
          <SidebarLink
            icon={ShoppingCart}
            text="Orders"
            isActive={activeTab === "orders"}
            onClick={() => {setActiveTab("orders"); if(window.innerWidth < 1024)setIsSidebarOpen(false)}}
          />
        </nav>
      </motion.div>

      {/* Main Content */}
      <main
        className={`
        transition-all duration-300 ease-in-out
        lg:ml-64
        lg:p-6
      `}
      >
        {activeTab === "products" && (
          <div className="space-y-6 ">
            {/* Loader */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
                    <Loader2 className="text-white animate-spin" size={64} />
                    <p className="text-xl text-white bg-gray-600 rounded-xl py-2 px-4">It might take a while , please wait.</p>
                </div>
            )}
            <div className="flex justify-between items-center md:mt-0 mt-2 md:mx-0 mx-2">
              <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditingProduct(null);
                  setNewProduct(initialProductState);
                  setIsModalOpen(true);
                }}
                className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                <Plus size={20} />
                <span>Add Product</span>
              </motion.button>
            </div>

            <motion.div layout className="grid gap-4">
              {products &&
                Array.isArray(products) &&
                products.length > 0 &&
                products.map((product) => (
                  <CustomCard key={product._id}>
                    <div className="p-4 flex items-center space-x-4">
                      <img
                        src={product?.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                          {product.name}
                        </h3>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                          <span>₹{Number(product.price || 0).toFixed(2)}</span>
                          <span>•</span>
                          <span>{product.stock} in stock</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(product)}
                        className="p-2 hover:bg-orange-50 rounded-full transition-colors duration-200"
                      >
                        <Pencil size={25} className="text-orange-500" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setConfirmDeleteId(product._id)}
                        className="p-2 hover:bg-orange-50 rounded-full transition-colors duration-200"
                      >
                        <Trash2 size={25} className="text-red-500" />
                      </motion.button>
                    </div>
                  </CustomCard>
                ))}
            </motion.div>
          </div>
        )}

        {activeTab === "orders" && <Orders />}
      </main>

      {/* Product Modal (Add/Edit) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-40 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setIsModalOpen(false)}
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative z-10"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 hover:bg-orange-50 rounded-full"
                  >
                    <X size={20} className="text-gray-500" />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Product Image (Click on Image to Edit)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          className="hidden"
                          accept="image/*"
                        />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="relative flex justify-center items-center cursor-pointer"
                        >
                          <div className="w-[20rem] h-[15rem] aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                            {editingProduct?.imagePreview ||
                            newProduct.imagePreview ? (
                              <img
                                src={
                                  editingProduct?.imagePreview ||
                                  newProduct.imagePreview
                                }
                                alt="Preview"
                                className="w-full h-full rounded-lg"
                              />
                            ) : (
                              <div className="text-center p-4">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">
                                  Click to upload image
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProduct?.name || newProduct.name}
                        onChange={(e) => {
                          if (editingProduct) {
                            setEditingProduct({
                              ...editingProduct,
                              name: e.target.value,
                            });
                          } else {
                            setNewProduct({
                              ...newProduct,
                              name: e.target.value,
                            });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter product name"
                      />
                    </div>

                    {/* Price Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        required
                        value={editingProduct?.price || newProduct.price}
                        onChange={(e) => {
                          if (editingProduct) {
                            setEditingProduct({
                              ...editingProduct,
                              price: e.target.value,
                            });
                          } else {
                            setNewProduct({
                              ...newProduct,
                              price: e.target.value,
                            });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter price"
                        step="0.01"
                      />
                    </div>

                    {/* stock Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock
                      </label>
                      <input
                        type="number"
                        required
                        value={editingProduct?.stock || newProduct.stock}
                        onChange={(e) => {
                          if (editingProduct) {
                            setEditingProduct({
                              ...editingProduct,
                              stock: e.target.value,
                            });
                          } else {
                            setNewProduct({
                              ...newProduct,
                              stock: e.target.value,
                            });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter stock quantity"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200"
                      >
                        {editingProduct ? "Save Changes" : "Add Product"}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

        {/* Delete Confirmation Modal */}
        {confirmDeleteId && <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="bg-white rounded-lg p-8 max-w-md w-full"
            >
                <h2 className="text-lg font-bold text-gray-900 mb-4">Delete Product
                </h2>
                <p className="text-gray-600">Are you sure you want to delete this product? This action cannot be undone.</p>
                <div className="flex items-center justify-between pt-4">
                    <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                    onClick={() => {
                        handleDelete(confirmDeleteId);
                        setConfirmDeleteId(null);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                        Delete
                    </button>
                </div>
            </motion.div>
        </motion.div>
        }


    </div>
  );
};

export default Admin;
