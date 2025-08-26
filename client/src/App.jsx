// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminPages from "./pages/AdminPages";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default Route Redirect */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminPages />} />
      </Routes>
    </Router>
  );
};

export default App;
