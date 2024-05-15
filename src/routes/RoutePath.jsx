import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/Login/LoginPage";
import Home from "../components/Home/Home";
import Summary from "../components/Home/Summary";
import RoleSummary from "../components/Role/RoleSummary";
import UserSummary from "../components/User/UserSummary";
import SaleEdit from "../components/Home/SalesEdit";
import Appsssss from "../components/Home/mdb";


export default function RoutesPath() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />

      <Route path="/Sales" element={<Summary />} />
      <Route path="/sale" element={<SaleEdit />} />
      <Route path="/User" element={<UserSummary />} />

      {/* <Route path="/Sales" element={<Appsssss />} /> */}
      {/* <Route path="/sale" element={<Appsssss />} /> */}

     
    </Routes>
  );
}
