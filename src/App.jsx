import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./componetnts/Navbar";
import Footer from "./componetnts/Footer";

const App = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default App;
