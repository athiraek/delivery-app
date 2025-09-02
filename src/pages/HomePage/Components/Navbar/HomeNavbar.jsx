import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../../../supabase-client';
import searchIcon from '../../../../assets/images/search_icon.png';
import AuthModal from '../Signin/AuthModal';
import './HomeNavbar.css';

function HomeNavbar() {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchText.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      const { data, error } = await supabase
        .from('menu_items')
        .select('name')
        .ilike('name', `%${searchText}%`); // Case-insensitive match

      if (error) {
        console.error('Suggestion fetch error:', error);
        setSuggestions([]);
      } else {
        // Remove duplicates and show max 8
        const unique = Array.from(new Set(data.map(item => item.name))).slice(0, 8);
        setSuggestions(unique);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchText]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim() !== '') {
      navigate(`/Menu?search=${encodeURIComponent(searchText)}`);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (value) => {
    setSearchText(value);
    navigate(`/Menu?search=${encodeURIComponent(value)}`);
    setSuggestions([]);
  };

  return (
    <>
      <Navbar expand="lg" className="homeNav-main">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="homeNav-brand">Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="homeNav-collapse" />
          <Navbar.Collapse id="homeNav-collapse">
            <Nav className="homeNav-links">
              <Nav.Link as={Link} to="/Menu" className="homeNav-link">Menu</Nav.Link>
              <Nav.Link as={Link} to="/cart" className="homeNav-link">Cart</Nav.Link>
              <Nav.Link onClick={() => setShowLogin(true)} className="homeNav-link homeNav-signin">Sign In</Nav.Link>
            </Nav>

            <Form className="homeNav-searchForm" onSubmit={handleSearch}>
              <div className="homeNav-searchWrapper">
                <Form.Control
                  type="search"
                  placeholder="Search menu..."
                  className="homeNav-searchInput"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  autoComplete="off"
                />
                {suggestions.length > 0 && (
                  <ul className="homeNav-suggestions">
                    {suggestions.map((item, idx) => (
                      <li
                        key={idx}
                        className="homeNav-suggestion"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Button type="submit" className="homeNav-searchBtn">
                <img src={searchIcon} alt="Search" className="homeNav-searchIcon" />
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {showLogin && <AuthModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default HomeNavbar;
