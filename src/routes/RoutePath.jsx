import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/Login/LoginPage";
import Home from "../components/Home/Home";
import Summary from "../components/Home/Summary";
import SaleEdit from "../components/Home/SalesEdit";


export default function RoutesPath() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />

      <Route path="/Sales" element={<Summary />} />
      <Route path="/sale" element={<SaleEdit />} />


     
    </Routes>
  );
}
