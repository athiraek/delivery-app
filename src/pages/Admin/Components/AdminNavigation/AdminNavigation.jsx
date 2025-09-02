import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './AdminNavigation.css';

function Navbarr() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here (e.g., Supabase signOut)
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="admin-navbar px-4" variant="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/admin" className="brand">
          Admin Panel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar" />
        <Navbar.Collapse id="admin-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/AdminMenuList">View Menu</Nav.Link>
            <Nav.Link as={Link} to="/AdminMenuAdd">Add Menu</Nav.Link>
            <Nav.Link as={Link} to="/AdminOrder">View Orders</Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbarr;
