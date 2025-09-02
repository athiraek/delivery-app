import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css'; // Optional: for custom styling
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer bg-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4}>
            <h5>Food Delivery  App</h5>
            <p>Delicious meals delivered to your door.</p>
          </Col>

          <Col md={4}>
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/MenuItemList">Menu</Link></li>
              <li><Link to="/admin/cart">Cart</Link></li>
              <li><Link to="/auth">Sign In</Link></li>
            </ul>
          </Col>

          <Col md={4}>
            <h6>Contact</h6>
            <p>Email: support@foodie.com</p>
            <p>Phone: +91 98765 43210</p>
            <div className="footer-social-icons">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaTwitter /></a>
            </div>
          </Col>
        </Row>
        <hr />
        <p className="text-center mb-0">&copy; {new Date().getFullYear()} Foodie App. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;
