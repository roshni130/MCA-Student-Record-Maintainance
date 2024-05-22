import React from 'react'
import BITlogo from "../assets/BITlogo.png";
import home from "../assets/home.png";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg rounded shadow-sm">
    <div className="container-fluid">
      <a href="/" className="navbar-brand text-light">
        <img
          src={BITlogo}
          width="60"
          height="60"
          className="d-inline-block"
          alt="logo"
        />
        | Birla Institute of Technology Mesra
      </a>
      <div className="nav">
        <img
          src={home}
          width="30"
          height="30"
          className="d-inline-block mt-1"
          alt="home icon"
        />
        <a href="/" className="nav-link text-light ">
          Home
        </a>
        <a
          href="/"
          className="nav-link text-light"
        >
          FAQ
        </a>
      </div>
    </div>
  </nav>
          

  );
}

export default Header