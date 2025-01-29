import { BrowserRouter,Routes,Route } from "react-router-dom";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import CheckoutForm from "./pages/CheckoutForm";
import Admin from "./admin/Admin";
import LoginPage from "./admin/LoginPage";

// Main App Component
const App = () => {

  // const location = useLocation();

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<><Home/><Cart/></>} />
      <Route path="/checkout" element={<CheckoutForm />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin@mere-bankey-bihari" element={<Admin />} />
    </Routes>
    </BrowserRouter>
  );
};

export default App;