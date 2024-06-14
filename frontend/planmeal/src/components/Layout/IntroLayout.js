// src/components/Layout/IntroLayout.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const IntroLayout = ({ children }) => {
  return (
    <Container fluid>
      <Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Col xs={12} md={8} lg={6} className="text-center">
          <h1>Welcome to the Meal Planner</h1>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default IntroLayout;
