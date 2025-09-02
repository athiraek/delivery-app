import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import User from "./pages/User/User";
import Admin from "./pages/Admin/Admin";
import AdminMenuList from "./pages/Admin/Components/AdminMenuList/AdminMenuList";
import AdminDashboard from "./pages/Admin/Components/AdminDashboard/AdminDashboard";
import AdminOrderPage from "./pages/Admin/Components/AdminOrderPage/AdminOrderPage";
import AuthModal from "./pages/HomePage/Components/Signin/AuthModal";
import Cart from "./pages/CartPage/CartPage";
import MenuPage from "./pages/MenuPage/MenuPage";
import MenuItemDetail from "./pages/MenuPage/components/MenuItemDetail/MenuItemDetail";
import CheckoutPage from "./pages/User/CheckoutPage/CheckoutPage";
import Signin from "./pages/CartPage/components/Signin/Signin";
import OrdersPage from "./pages/User/OrdersPage/OrdersPage";
import UserCart from "./pages/User/UserCart/UserCart";
import UserMenu from "./pages/User/UserMenu/UserMenu";
import Payment from "./pages/User/PaymentPage/Payment/Payment";
import OrderSuccess from "./pages/User/OrderSuccess/OrderSucess";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter basename="/delivery-app">
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthModal />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/Menu" element={<MenuPage />} />
          <Route path="/MenuItem/:id" element={<MenuItemDetail />} />
          <Route path="/cart" element={<Cart />} />

          {/* User Protected Routes */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute admin={false}>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-menu"
            element={
              <ProtectedRoute>
                <UserMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-cart"
            element={
              <ProtectedRoute>
                <UserCart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute admin={false}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <ProtectedRoute admin={false}>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute admin={true}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AdminMenuList"
            element={
              <ProtectedRoute admin={true}>
                <AdminMenuList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AdminMenuAdd"
            element={
              <ProtectedRoute admin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AdminOrder"
            element={
              <ProtectedRoute admin={true}>
                <AdminOrderPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
