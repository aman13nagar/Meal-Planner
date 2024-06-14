// components/ForgotPassword.js
import React, { useState } from 'react';
import api from '../../utils/api';
import { Form, Button, Container, Alert,Row,Card,Col } from 'react-bootstrap';
import '../../assets/css/Forgot.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/password/forgot-password', { email });
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response.data.error);
      setMessage('');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center auth-container">
      <Row>
        <Col md={12}>
          <Card className="auth-card">
            <Card.Body>
              <h2 className="auth-title">Forgot Password</h2>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="auth-button">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
