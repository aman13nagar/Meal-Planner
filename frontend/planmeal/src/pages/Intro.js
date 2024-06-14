// src/components/IntroPage.js
import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col,Button,Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/IntroPage.css';
import LoginSuccessModal from '../components/Auth/LoginSuccessModal';
import nutritionimage from'../assets/images/louis-hansel-GiIiRV0FjwU-unsplash.jpg';
import nutritionimage2 from '../assets/images/brooke-lark-nTZOILVZuOg-unsplash (1).jpg';
import foodimage1 from '../assets/images/top-view-meals-tasty-yummy-different-pastries-dishes-brown-surface.jpg';
import foodimage2 from '../assets/images/zan-lazarevic-30809AYY3rg-unsplash.jpg';
import axios from "axios";

const IntroPage = () => {
  const authContext = useContext(AuthContext);
  const { logout, isAuthenticated } = authContext;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSearchModal,setSearchModal]=useState(false);
  const [recipes, setRecipes] = useState([]);

  const onLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (searchQuery.length > 2) { // To avoid too many requests, search after 3 characters
      const fetchData = async () => {
        const apiKey='546b5abc7a3d442bacf963272f441ac3';
        try {
          const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
            params: {
              query: searchQuery,
              apiKey: apiKey,
              number: 10,
            },
          });
          setRecipes(response.data.results);
          setSearchModal(true);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };
      fetchData();
    }
  }, [searchQuery]);

  const handleCloseModal = () => setSearchModal(false);

  useEffect(() => {
    if (isAuthenticated) {
      setShowModal(true);
    }
  }, [isAuthenticated]);

  return (
    <div className="intro-page">
      <header className="header">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">Meal Planner</Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <form className="form-inline my-2 my-lg-0">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for recipes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="submit">
                        <FontAwesomeIcon icon={faSearch} />
                      </button>
                    </div>
                  </div>
                </form>
              </li>
            </ul>
            <Nav className="ml-auto">
              {isAuthenticated ? (
                <NavDropdown title={<><FontAwesomeIcon icon={faUser} className="mr-1" /> My Account</>} id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/meal-planner">Meal Planner</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/recipes">Recipes</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </>
              )}
            </Nav>
          </div>
        </nav>
      </header>
      <Container className="intro-content">
        <Row className="justify-content-center">
          <Col xs={12} md={8} className="text-center">
            <h1>Welcome to the Meal Planner</h1>
            <p>Your journey to organized meal planning starts here. Plan your meals, save time, and eat healthy with our easy-to-use meal planner.</p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary mx-2">Get Started For Free</Link>
            )}
          </Col>
        </Row>
        <Row className="mt-5 features">
          <Col xs={12} md={4} className="text-center">
            <i className="fas fa-utensils fa-3x intro-icon"></i>
            <h3>Plan Your Meals</h3>
            <p>Easily plan your meals for the week and save your favorite recipes.</p>
          </Col>
          <Col xs={12} md={4} className="text-center">
            <i className="fas fa-clock fa-3x intro-icon"></i>
            <h3>Save Time</h3>
            <p>Reduce the stress of last-minute meal decisions and grocery shopping.</p>
          </Col>
          <Col xs={12} md={4} className="text-center">
            <i className="fas fa-heart fa-3x intro-icon"></i>
            <h3>Eat Healthy</h3>
            <p>Make healthier food choices and keep track of your nutrition.</p>
          </Col>
        </Row>
        <Row className="mt-5 nutrition-section">
          <Col xs={12} md={6}>
            <img src={nutritionimage} alt="Healthy Food" className="img-fluid rounded" />
          </Col>
          <Col xs={12} md={6}>
            <h2>Nutrition Tips</h2>
            <p>Learn how to balance your diet with our nutrition tips and guides. Whether you're looking to lose weight, gain muscle, or simply eat healthier, we've got you covered.</p>
            <ul>
              <li>Understand the importance of macronutrients and micronutrients</li>
              <li>Discover delicious and healthy recipes</li>
              <li>Get tips for meal prepping and planning</li>
              <li>Learn how to read nutrition labels</li>
            </ul>
          </Col>
        </Row>
        <Row className="mt-5 recipes-section">
          <Col xs={12} className="text-center">
            <h2>Explore Recipes</h2>
            <p>Discover a variety of recipes tailored to your dietary preferences and nutritional needs. From quick weeknight dinners to elaborate weekend feasts, find recipes that inspire and nourish you.</p>
          </Col>
          <Col xs={12} md={4} className="text-center">
            <img src={foodimage1} alt="Recipe 1" className="img-fluid rounded mb-3" />
            <h3>Quick & Easy</h3>
            <p>Simple recipes that can be prepared in under 30 minutes. Perfect for busy weeknights.</p>
          </Col>
          <Col xs={12} md={4} className="text-center">
            <img src={nutritionimage2} alt="Recipe 2" className="img-fluid rounded mb-3" />
            <h3>Healthy Choices</h3>
            <p>Nutritious recipes that help you stay on track with your health goals without sacrificing flavor.</p>
          </Col>
          <Col xs={12} md={4} className="text-center">
            <img src={foodimage2} alt="Recipe 3" className="img-fluid rounded mb-3" />
            <h3>Gourmet Meals</h3>
            <p>Elevate your dining experience with gourmet recipes that impress your family and friends.</p>
          </Col>
        </Row>
        <Row className="mt-5 success-stories">
          <Col xs={12} className="text-center">
            <h2>Success Stories</h2>
            <p>Hear from our users who have transformed their lives with Meal Planner.</p>
          </Col>
          <Col xs={12} md={4} className="text-center">
            <blockquote>
              "Using Meal Planner has helped me lose 20 pounds and keep it off. It's been life-changing!"
            </blockquote>
            <cite>- Alex Johnson</cite>
          </Col>
          <Col xs={12} md={4} className="text-center">
            <blockquote>
              "As a busy mom, Meal Planner saves me so much time and stress. I love it!"
            </blockquote>
            <cite>- Emily Roberts</cite>
          </Col>
          <Col xs={12} md={4} className="text-center">
            <blockquote>
              "I've never felt healthier and more organized. Meal Planner is a must-have tool."
            </blockquote>
            <cite>- Michael Lee</cite>
          </Col>
        </Row>
        {isAuthenticated ? (
          <Row className="mt-5 advanced-content">
            <Col xs={12} className="text-center">
              <h2>Advanced Meal Planning Tips</h2>
              <p>Take your meal planning to the next level with our expert tips and tricks.</p>
              <ul>
                <li>Utilize batch cooking to save time during the week.</li>
                <li>Incorporate seasonal ingredients for fresh and flavorful meals.</li>
                <li>Plan meals around your fitness goals for optimal results.</li>
                <li>Keep a well-stocked pantry to make meal prep a breeze.</li>
              </ul>
            </Col>
          </Row>
        ) : (
          <Row className="mt-5 call-to-action">
            <Col xs={12} className="text-center">
              <h2>Start Your Meal Planning Journey Today!</h2>
              <p>Join thousands of satisfied users who are already enjoying the benefits of organized meal planning.</p>
              <Link to="/register" className="btn btn-lg btn-primary mx-2">Sign Up Now</Link>
              <Link to="/login" className="btn btn-lg btn-secondary mx-2">Login</Link>
            </Col>
          </Row>
        )}
      </Container>
      <footer className="intro-footer">
        <Container>
          <Row>
            <Col xs={12} className="text-center">
              <p>&copy; 2024 Meal Planner. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
      <Modal show={showSearchModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Search Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {recipes.length > 0 ? (
            <div className="search-results">
              <Row>
                {recipes.map((recipe) => (
                  <Col key={recipe.id} xs={12} md={4} className="text-center mb-4">
                    <img src={`https://spoonacular.com/recipeImages/${recipe.id}-312x231.jpg`} alt={recipe.title} className="img-fluid rounded mb-2" />
                    <h5>{recipe.title}</h5>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <p>No results found. Please try a different search.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {isAuthenticated?(
        <LoginSuccessModal show={showModal} onHide={() => setShowModal(false)} />
      ):(
        <p></p>
      )
      }
    </div>
  );
};

export default IntroPage;



