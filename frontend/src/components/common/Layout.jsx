import React from "react";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
