import React, { useState, useContext, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Form, Alert, Modal, Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import '../assets/css/MealPlanner.css';

const MealPlanner = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const [mealPlans, setMealPlans] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatedMealPlans, setGeneratedMealPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (user) {
      fetchMealPlans();
    }
  }, [user]);

  const fetchNutritionalData = async (meal) => {
    try {
      const res = await api.post('meal-plans/nutrition-info', { meal });
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const fetchMealPlans = async () => {
    try {
      const res = await api.get('/meal-plans/daily-meals');
      setMealPlans(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (day, mealType, value) => {
    setFormData({
      ...formData,
      [day]: {
        ...formData[day],
        [mealType]: value,
      },
    });
  };

  const handleSave = async (day) => {
    const currentDate = new Date().toISOString().split('T')[0];
    try {
      const meals = formData[day];
      const calculateMealNutrition = async (meal) => {
        let totalNutrition = {
          calories: 0,
          fat: 0,
          protein: 0,
          carbs: 0,
        };
        for (const mealItem of meal.split(',')) {
          const nutritionalData = await fetchNutritionalData(mealItem);
          if (nutritionalData && nutritionalData.status !== 'error') {
            totalNutrition.calories += nutritionalData.calories.value;
            totalNutrition.fat += nutritionalData.fat.value;
            totalNutrition.protein += nutritionalData.protein.value;
            totalNutrition.carbs += nutritionalData.carbs.value;
          }
        }
        return totalNutrition;
      };
      const nutritionalData = {
        breakfast: await calculateMealNutrition(meals.breakfast),
        lunch: await calculateMealNutrition(meals.lunch),
        dinner: await calculateMealNutrition(meals.dinner),
      };

      const existingPlan = mealPlans.find((plan) => plan.date === currentDate);
      console.log(existingPlan, mealPlans);
      if (existingPlan) {
        await api.put(`/meal-plans/daily-meals/${existingPlan._id}`, {
          meals,
          nutritionalData,
        });
        setMealPlans((prevPlans) =>
          prevPlans.map((plan) =>
            plan._id === existingPlan._id ? { ...plan, meals, nutritionalData } : plan
          )
        );
      } else {
        console.log(currentDate);
        const res = await api.post('/meal-plans/daily-meals', {
          date: currentDate,
          meals,
          nutritionalData,
        });
        setMealPlans((prevPlans) => [res.data, ...prevPlans]);
      }
      setError('');
      window.location.reload();
      
    } catch (err) {
      setError(err.response?.data?.msg || 'Error saving meal plan');
      console.error(err);
    }
  };

  const handleGenerateMealPlan = async () => {
    try {
      const res = await api.get('/meal-plans/generate');
      const generatedPlan = res.data;
      console.log(generatedPlan);
      setGeneratedMealPlans([generatedPlan]);
      setError('');
    } catch (err) {
      setError('Error generating meal plan');
      console.error(err);
    }
  };

  const formattedDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const currentDate = new Date().toISOString().split('T')[0];
  const currentDay = daysOfWeek[new Date().getDay() - 1]; // Get the current day of the week
  const todayPlan = mealPlans.find((plan) => plan.date === currentDate);

  const handleFormSubmit = (day) => {
    if (day !== currentDay) {
      setModalMessage(`You can only plan for ${currentDay}.`);
      setShowModal(true);
    } else {
      handleSave(day);
    }
  };

  return (
    <Container className="meal-planner-container">
      <h1 className="text-center my-4">Meal Planner</h1>
      <p className="text-center mb-4">Plan your meals for the week and stay organized with our easy-to-use meal planner.</p>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="mb-4">
        {daysOfWeek.map((day) => (
          <Col md={6} lg={4} className="mb-4" key={day}>
            <Card className="meal-card">
              <Card.Header className="meal-card-header">{day}</Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group controlId={`formBreakfast${day}`}>
                    <Form.Label>Breakfast</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter breakfast plan"
                      onChange={(e) => handleChange(day, 'breakfast', e.target.value)}
                      value={formData[day]?.breakfast || ''}
                      disabled={isLoading}
                    />
                  </Form.Group>
                  <Form.Group controlId={`formLunch${day}`}>
                    <Form.Label>Lunch</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter lunch plan"
                      onChange={(e) => handleChange(day, 'lunch', e.target.value)}
                      value={formData[day]?.lunch || ''}
                      disabled={isLoading}
                    />
                  </Form.Group>
                  <Form.Group controlId={`formDinner${day}`}>
                    <Form.Label>Dinner</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter dinner plan"
                      onChange={(e) => handleChange(day, 'dinner', e.target.value)}
                      value={formData[day]?.dinner || ''}
                      disabled={isLoading}
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    className="mt-3 save-button"
                    onClick={() => handleFormSubmit(day)}
                    disabled={isLoading}
                  >
                    Save
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Row>
          {generatedMealPlans.map((mealPlan) => (
            <Col md={6} lg={4} className="mb-4" key={mealPlan.id}>
              <Card className="meal-plan-card">
                <Card.Header className="meal-card-header">{formattedDate(currentDate)}</Card.Header>
                <Card.Body>
                  <Card.Text>
                    <strong>Breakfast:</strong> {mealPlan.meals[0].title || 'N/A'} <br />
                    <strong>Lunch:</strong> {mealPlan.meals[1].title || 'N/A'} <br />
                    <strong>Dinner:</strong> {mealPlan.meals[2].title || 'N/A'}
                  </Card.Text>
                  {mealPlan.nutrients && (
                    <Card.Text>
                      <h5>Nutritional Information:</h5>
                      <strong>Calories:</strong> {mealPlan.nutrients.calories || 'N/A'}<br />
                      <strong>Carbohydrates:</strong> {mealPlan.nutrients.carbohydrates || 'N/A'}<br />
                      <strong>Fat:</strong> {mealPlan.nutrients.fat || 'N/A'}<br />
                      <strong>Protein:</strong> {mealPlan.nutrients.protein || 'N/A'}
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Row className="adv">
        <Button variant="info" onClick={handleGenerateMealPlan} disabled={isLoading}>
          Generate Meal Plan
        </Button>
        <Link to={`/meal-planner-form`}>
          <Button variant="info">Whole Week Plan</Button>
        </Link>
      </Row>
      <h2 className="text-center my-4">Saved Meal Plans</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Row>
          {mealPlans.map((mealPlan) => {
            const totalCalories = Object.values(mealPlan.nutritionalData).reduce((sum, meal) => sum + (meal.calories ? Number(meal.calories) : 0), 0);
            const totalFat = Object.values(mealPlan.nutritionalData).reduce((sum, meal) => sum + (meal.fat ? Number(meal.fat) : 0), 0);
            const totalProtein = Object.values(mealPlan.nutritionalData).reduce((sum, meal) => sum + (meal.protein ? Number(meal.protein) : 0), 0);
            const totalCarbs = Object.values(mealPlan.nutritionalData).reduce((sum, meal) => sum + (meal.carbs ? Number(meal.carbs) : 0), 0);

            return (
              <Col md={6} lg={4} className="mb-4" key={mealPlan._id}>
                <Card className="meal-plan-card">
                  <Card.Header className="meal-card-header">{formattedDate(mealPlan.date)}</Card.Header>
                  <Card.Body>
                    <Card.Text>
                      <strong>Breakfast:</strong> {mealPlan.meals.breakfast || 'N/A'} <br />
                      <strong>Lunch:</strong> {mealPlan.meals.lunch || 'N/A'} <br />
                      <strong>Dinner:</strong> {mealPlan.meals.dinner || 'N/A'}
                    </Card.Text>
                    {mealPlan.nutritionalData && (
                      <Card.Text>
                        <h5>Nutritional Information:</h5>
                        <div>
                          <table className="uniquetable">
                            <thead>
                              <tr>
                                <th>Meal</th>
                                <th>Calories</th>
                                <th>Fat (g)</th>
                                <th>Protein (g)</th>
                                <th>Carbs (g)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(mealPlan.nutritionalData).map(([mealType, nutritionalInfo]) => (
                                <tr key={mealType}>
                                  <td>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</td>
                                  <td>{nutritionalInfo.calories ? nutritionalInfo.calories : 'N/A'}</td>
                                  <td>{nutritionalInfo.fat ? nutritionalInfo.fat : 'N/A'}</td>
                                  <td>{nutritionalInfo.protein ? nutritionalInfo.protein : 'N/A'}</td>
                                  <td>{nutritionalInfo.carbs ? nutritionalInfo.carbs : 'N/A'}</td>
                                </tr>
                              ))}
                              <tr>
                                <td><strong>Total</strong></td>
                                <td><strong>{totalCalories}</strong></td>
                                <td><strong>{totalFat}</strong></td>
                                <td><strong>{totalProtein}</strong></td>
                                <td><strong>{totalCarbs}</strong></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </Card.Text>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invalid Day</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MealPlanner;


