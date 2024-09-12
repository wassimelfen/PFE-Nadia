/** @format */

import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const CNavbar = () => {
  return (
    <Navbar bg='dark' variant='dark' expand='lg' className='mainNav'>
      <Navbar.Brand className='px-5' as={Link} to='/'>
        <img src='../context/TunisAirBackgournd.png' alt='TunisAir' />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse
        id='basic-navbar-nav'
        className='justify-content-end px-5'>
        <Nav>
          <Nav.Link as={Link} to='/dashboard'>
            Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to='/tickets'>
            Tickets
          </Nav.Link>
          <Nav.Link as={Link} to='/'>
            Logout
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CNavbar;
