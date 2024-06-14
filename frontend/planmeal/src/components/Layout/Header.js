import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import '../../assets/css/Header.css'; 

const Header = () => {
  const authContext = useContext(AuthContext);
  const { logout, isAuthenticated } = authContext;
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <Navbar expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">Meal Planner</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/dashboard" className="nav-link-custom">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/meal-planner" className="nav-link-custom">Meal Planner</Nav.Link>
                  <Nav.Link as={Link} to="/recipes" className="nav-link-custom">Recipes</Nav.Link>
                  <Nav.Link as={Link} to="/add-recipe" className="nav-link-custom">Add Recipe</Nav.Link>
                  <Nav.Link as={Link} to="/profile" className="nav-link-custom">Profile</Nav.Link>
                  <Button variant="outline-danger" onClick={onLogout} className="ml-2 custom-button">Logout</Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="nav-link-custom">Login</Nav.Link>
                  <Button variant="outline-success" as={Link} to="/register" className="ml-2 custom-button">Register</Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;

  