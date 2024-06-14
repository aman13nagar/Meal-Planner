// src/components/NutritionInfo.js
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col,Spinner, Alert,Table  } from 'react-bootstrap';
import '../../assets/css/Nutritioninfo.css'
const NutritionInfo = () => {
  const [nutrition, setNutrition] = useState(null);
  const { recipeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const res = await api.post(`/nutritions/${recipeId}`);
        setNutrition(res.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching nutrition details');
        setLoading(false);
      }
    };

    fetchNutrition();
  }, [recipeId]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="nutrition-container my-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-3">
            
            <Card.Body>
              <Table striped bordered hover className="nutrition-table">
                <thead>
                  <tr>
                    <th>Nutrient</th>
                    <th>Amount</th>
                    <th>% Daily Needs</th>
                  </tr>
                </thead>
                <tbody>
                  {nutrition.nutrients.map((nutrient, index) => (
                    <tr key={index}>
                      <td>{nutrient.name}</td>
                      <td>{nutrient.amount} {nutrient.unit}</td>
                      <td>{nutrient.percentOfDailyNeeds}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h4>Bad Nutrients</h4>
              <Table striped bordered hover className="nutrition-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>% Daily Needs</th>
                  </tr>
                </thead>
                <tbody>
                  {nutrition.bad.map((item, index) => (
                    <tr key={index}>
                      <td>{item.title}</td>
                      <td>{item.amount}</td>
                      <td>{item.percentOfDailyNeeds}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h4>Good Nutrients</h4>
              <Table striped bordered hover className="nutrition-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>% Daily Needs</th>
                  </tr>
                </thead>
                <tbody>
                  {nutrition.good.map((item, index) => (
                    <tr key={index}>
                      <td>{item.title}</td>
                      <td>{item.amount}</td>
                      <td>{item.percentOfDailyNeeds}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h4>Properties</h4>
              <Table striped bordered hover className="nutrition-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {nutrition.properties.map((property, index) => (
                    <tr key={index}>
                      <td>{property.name}</td>
                      <td>{property.amount} {property.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h4>Flavonoids</h4>
              <Table striped bordered hover className="nutrition-table">
                <thead>
                  <tr>
                    <th>Flavonoid</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {nutrition.flavonoids.map((flavonoid, index) => (
                    <tr key={index}>
                      <td>{flavonoid.name}</td>
                      <td>{flavonoid.amount} {flavonoid.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NutritionInfo;
