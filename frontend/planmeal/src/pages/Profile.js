import React, { useContext, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import '../assets/css/Profile.css';
const Profile = () => {
  const authContext = useContext(AuthContext);
  const { logout, user } = authContext;
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  return (
    <div className="profile-page">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <Card className="profile-card">
              <Card.Body>
                <Row>
                  <Col xs={12} md={4} className="text-center mb-3">
                    <FontAwesomeIcon icon={faUser} className="profile-icon" />
                  </Col>
                  <Col xs={12} md={8}>
                    <h3>Name</h3>
                    <p>{user?.name}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="profile-card">
              <Card.Body>
                <Row>
                  <Col xs={12} md={4} className="text-center mb-3">
                    <FontAwesomeIcon icon={faEnvelope} className="profile-icon" />
                  </Col>
                  <Col xs={12} md={8}>
                    <h3>Email</h3>
                    <p>{user?.email}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="profile-card">
              <Card.Body>
                <Row>
                  <Col xs={12} md={4} className="text-center mb-3">
                    <FontAwesomeIcon icon={faCalendarAlt} className="profile-icon" />
                  </Col>
                  <Col xs={12} md={8}>
                    <h3>Date of Birth</h3>
                    <p>{user?.dateOfBirth ? formatDate(user.dateOfBirth) : 'N/A'}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
