import React from "react";
import Home from "../views/Home";
import Login from "../views/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
