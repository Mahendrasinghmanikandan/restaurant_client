import React, { useState } from "react";

const Navbar = () => {
  return (
    <>
      <header className="w-screen py-5 px-10 flex justify-between items-center shadow">
        <img
          className="w-[70px] h-[70px]  rounded"
          src="https://png.pngtree.com/png-clipart/20220220/original/pngtree-pizza-chef-italian-banner-restaurant-mascot-pizzeria-logo-png-image_7271224.png"
          alt=""
        />
        <div className="flex gap-x-10 items-center">
          <div className="nav_menu_items">Home</div>
          <div className="nav_menu_items">Menu</div>
          <div className="nav_menu_items">Tables</div>
          <div className="nav_menu_items">Shop</div>
          <div className="nav_menu_items">Contact</div>
        </div>
        <div className="flex gap-x-2 items-center">
          <div className="secondary_button">Signup</div>
          <div className="primary_button">Login</div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
