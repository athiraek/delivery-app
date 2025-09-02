import React from "react";
import AdminOrders from "./components/AdminOrder";

import Navbarr from "../AdminNavigation/AdminNavigation";

const AdminOrderPage = () => {
  return (
    <div>
      <Navbarr />
      <AdminOrders />
    </div>
  );
};

export default AdminOrderPage;
