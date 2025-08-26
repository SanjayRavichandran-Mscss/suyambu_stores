import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminMenus from "../components/AdminComponents/AdminMenus";

import AdminDashboard from "../components/AdminComponents/AdminDashboard";
import Analytics from "../components/AdminComponents/Analytics";
import ManageOrders from "../components/AdminComponents/ManageOrders";
import ManageCustomers from "../components/AdminComponents/ManageCustomers";
import ManageCategories from "../components/AdminComponents/ManageCategories";
import ManageProducts from "../components/AdminComponents/ManageProducts";
import Settings from "../components/AdminComponents/Settings";

const AdminPages = () => (
  <div className="min-h-screen bg-[#F4F6F8] flex flex-col">
    <AdminMenus />
    <main className="flex-1 p-10">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <Routes>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="customers" element={<ManageCustomers />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="settings" element={<Settings />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </main>
  </div>
);

export default AdminPages;
