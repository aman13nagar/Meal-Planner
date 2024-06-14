// src/components/Auth/Register.js
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { FaUserPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/Register.css'; // Custom CSS for additional styling
import imageurl from '../assets/images/brooke-lark-HlNcigvUi4Q-unsplash.jpg'
const Register = () => {
  const authContext = useContext(AuthContext);
  const { register, isAuthenticated, error, clearErrors } = authContext;
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    email: '',
    dateOfBirth:'',
    password: '',
    password2: ''
  });

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { name, email,dateOfBirth, password, password2 } = user;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    if (error) {
      setErrorMessage(error);
      setShowErrorModal(true);
      clearErrors();
    }
  }, [isAuthenticated, error, navigate, clearErrors]);

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      setErrorMessage('Passwords do not match');
      setShowErrorModal(true);
    } else {
      register({
        name,
        email,
        dateOfBirth,
        password
      });
    }
  };

  const handleCloseErrorModal = () => setShowErrorModal(false);

  return (
    <Container className="register-container d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col lg={6} className="d-none d-lg-block p-0">
          <div className="register-image-container">
            {/* <img src={imageurl} alt="Register" className="img-fluid" /> */}
          </div>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <Card className="shadow-sm p-3 mb-5 bg-white rounded">
            <Card.Body>
              <h1 className="text-center mb-4"><FaUserPlus /> Register</h1>
              <Form onSubmit={onSubmit}>
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required
                    placeholder="Enter your name"
                  />
                </Form.Group>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                    placeholder="Enter your email"
                  />
                </Form.Group>
                <Form.Group controlId="dateOfBirth" className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={dateOfBirth}
                    onChange={onChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    placeholder="Enter your password"
                  />
                </Form.Group>
                <Form.Group controlId="password2" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                    required
                    placeholder="Confirm your password"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Register
                </Button>
                <div className="d-flex justify-content-between">
                  <Link to="/login" className="text-decoration-none">Already have an account? Login</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseErrorModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Register;


