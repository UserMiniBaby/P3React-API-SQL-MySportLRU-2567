import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import SportsEquipment from "./components/SportsEquipment/SportsEquipment";
import AccountSettings from "./components/AccountSettings/AccountSettings";
import CheckoutPage from "./components/CheckoutPage/CheckoutPage"; 
import CartPage from "./components/CartPage/CartPage";
import BookingPage from "./components/BookingPage/BookingPage";  
import StatusPage from "./components/StatusPage/StatusPage";  
import DocumentDetailsPage from "./components/DocumentDetailsPage/DocumentDetailsPage"; 
import AuthProvider from "./context/AuthContext";
import Layout from "./components/layout/layout";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import { AuthContext } from "./context/AuthContext";
import AdminStadium from "./components/AdminStadium/Stadium";
import UStadium from "./components/UStadium/UStadium";
import AdminSportsEquipment from "./components/AdminSportsEquipment/AdminSportsEquipment";
import AdminBorrow from "./components/AdminBorrow/AdminBorrow";
import AdminUsers from "./components/AdminUsers/AdminUsers";
import AdminReserve from "./components/AdminReserve/AdminReserve";
import AdminSportsReduce from "./components/AdminSportsReduce/AdminSportsReduce";



function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<SportsEquipment />} />
            <Route path="/sports" element={<UStadium />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/checkoutpage" element={<CheckoutPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/booking/:itemName" element={<BookingPage />} /> 
            <Route path="/status" element={<StatusPage />} />
            <Route path="/document-details/:itemName" element={<DocumentDetailsPage />} /> {/* เพิ่มเส้นทางนี้ */}
          </Route>
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/stadium" element={<AdminStadium />} />
            <Route path="/dashboard/sportequipment" element={<AdminSportsEquipment />} />
            <Route path="/dashboard/sportreduce" element={<AdminSportsReduce />} />
            <Route path="/dashboard/sportborrow" element={<AdminBorrow />} />
            <Route path="/dashboard/sportborrow" element={<AdminBorrow />} />
            <Route path="/dashboard/stadiumreserve" element={<AdminReserve />} />
            <Route path="/dashboard/users" element={<AdminUsers />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
