
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const authContext = useContext(AuthContext);
  const { login, isAuthenticated, error, clearErrors } = authContext;
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const [showErrorModal, setShowErrorModal] = useState(false);

  const { email, password } = user;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    if (error) {
      setShowErrorModal(true);
      clearErrors();
    }
  }, [isAuthenticated, error, navigate, clearErrors]);

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  const handleCloseErrorModal = () => setShowErrorModal(false);

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row>
        <Col>
          <Card className="shadow-sm p-3 mb-5 bg-white rounded">
            <Card.Body>
              <h1 className="text-center mb-4"><FaUser /> Account Login</h1>
              <Form onSubmit={onSubmit}>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                    placeholder="Enter email"
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
                    placeholder="Enter password"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Login
                </Button>
                <div className="d-flex justify-content-between">
                  <Link to="/forgot-password" className="text-decoration-none">Forgot Password?</Link>
                  <Link to="/register" className="text-decoration-none">Don't have an account? Register</Link>
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
        <Modal.Body>Username and/or password is incorrect.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseErrorModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Login;


