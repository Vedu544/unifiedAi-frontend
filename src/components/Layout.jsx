import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import React from "react";

const Layout = () => {
  return (
    <div>
      <ToastContainer />
      <Outlet />
    </div>
  );
};

export default Layout