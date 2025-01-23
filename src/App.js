import { BrowserRouter,Routes,Route } from "react-router-dom";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import CheckoutForm from "./pages/CheckoutForm";

// Main App Component
const App = () => {

  // const location = useLocation();

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<><Home/><Cart/></>} />
      <Route path="/checkout" element={<CheckoutForm />} />
    </Routes>
    </BrowserRouter>
  );
};

export default App;