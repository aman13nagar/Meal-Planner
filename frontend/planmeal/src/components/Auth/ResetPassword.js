// components/ResetPassword.js
import React, { useState } from 'react';
import api from '../../utils/api';
import { useParams } from 'react-router-dom';
import { Form, Button, Container, Alert,Row,Col,Card } from 'react-bootstrap';
import '../../assets/css/Forgot.css'

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/password/reset-password/${token}`, { password });
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
              <h2 className="auth-title">Reset Password</h2>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="password">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="auth-button">
                  Reset Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
