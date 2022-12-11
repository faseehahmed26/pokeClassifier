import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import {
//   Container,
//   Form,
//   FormControl,
//   Nav,
//   Navbar,
//   NavDropdown,
// } from "react-bootstrap";
// import "./styles.css";
const NavigationBar = () => {
  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark navbar-style">
        <a className="navbar-brand" href="/#">
          Pokemon Detector
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to="/classifier" className="nav-link">
                Classifer
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default NavigationBar;
