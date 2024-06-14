// src/components/Layout/AppLayout.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';

const AppLayout = ({ children }) => {
    console.log('Rendering AppLayout')
  return (
    <Container fluid>
      <Header>{Header}</Header>
      <Row>
        <Col xs={10}>
          <main>{children}</main>
        </Col>
      </Row>
      <Footer>{Footer}</Footer>
    </Container>
  );
};

export default AppLayout;
