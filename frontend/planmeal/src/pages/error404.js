// components/NotFound.js
import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../assets/css/NotFound.css';

const NotFound = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center not-found-container">
      <Row>
        <Col md={12} className="text-center">
          {/* <Image src="/path/to/your/404-image.png" alt="404" className="not-found-image" /> */}
          <h1 className="not-found-title">404 - Page Not Found</h1>
          <p className="not-found-text">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/">
            <Button variant="primary" className="not-found-button">Go to Homepage</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
