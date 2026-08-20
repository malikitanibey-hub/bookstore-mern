import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import AllBooks from "./components/admin/AllBooks";
import AddBook from "./components/admin/AddBook";
import AdminLayout from "./components/admin/AdminLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./auth/AuthContext";
import { CartProvider } from "./auth/CartContext";
import CartPage from "./pages/CartPage";
import UpdateBook from "./components/admin/UpdateBook";
import BookDetails from "./pages/BookDetails";
import OnSaleProducts from "./components/OnSaleProducts";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ContactMessages from "./components/admin/ContactMessages";
import Products from "./pages/Products";
import Favorites from "./pages/Favorites";


function App() {
  //this mean to hide the header on page admin
  const location = useLocation();
  const hideHeader = /^\/admin(\/|$)/.test(location.pathname);

  return (
    <AuthProvider>
      <CartProvider>
        {!hideHeader && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element = {  <CartPage/>}/>
          <Route path="/on-sale" element = {  <OnSaleProducts/>}/>
          <Route path="/bookDetails/:id" element = {  <BookDetails/>}/>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/favorites" element={<Favorites />} />
          

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="add-book" element={<AddBook />} />
            <Route index element={<AllBooks />} />
            <Route path="/admin/update-book/:id" element={<UpdateBook />} />
            <Route path="/admin/contact" element={<ContactMessages />} />

          </Route>
        </Routes>
          {!hideHeader && <Footer />}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
