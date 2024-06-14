import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup } from 'react-bootstrap';
import { MealPlanContext } from '../../context/MealPlanContext';
import { RecipeContext } from '../../context/RecipeContext';
import RecipeModal from './RecipeModal'; // Import the RecipeModal component
import '../../assets/css/MealPlanner2.css';

const MealPlanner = () => {
  const mealPlanContext = useContext(MealPlanContext);
  const recipeContext = useContext(RecipeContext);

  const {
    mealPlans,
    getMealPlans,
    addMealPlan,
    deleteMealPlan,
    updateMealPlan,
    setCurrent,
    clearCurrent,
    current,
  } = mealPlanContext;

  const { recipes, getRecipes } = recipeContext;

  const [formData, setFormData] = useState({ name: '', selectedRecipes: [] });
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility

  useEffect(() => {
    getMealPlans();
    getRecipes();
  }, []);

  useEffect(() => {
    if (current !== null) {
      setFormData({
        name: current.name,
        selectedRecipes: current.recipes.map((recipe) => recipe._id),
      });
    } else {
      setFormData({ name: '', selectedRecipes: [] });
    }
  }, [current]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    const mealPlanData = {
      name: formData.name,
      recipes: formData.selectedRecipes,
    };

    if (current === null) {
      await addMealPlan(mealPlanData);
    } else {
      await updateMealPlan({ ...current, ...mealPlanData });
      clearCurrent();
    }

    setFormData({ name: '', selectedRecipes: [] });

    // Fetch the latest meal plans after add/update
    getMealPlans();
  };

  const onDelete = async (id) => {
    await deleteMealPlan(id);
    getMealPlans(); // Fetch the latest meal plans after deletion
  };

  const onEdit = (mealPlan) => {
    setCurrent(mealPlan);
  };

  // Function to handle selected recipes from the modal
  const handleSelectedRecipes = (selectedRecipes) => {
    setFormData((prevState) => ({
      ...prevState,
      selectedRecipes,
    }));
  };

  return (
    <Container className="meal-planner-page">
      <Row>
        <Col>
          <h1 className="text-center">Meal Planner</h1>
          <p className="text-center">Plan your meals for the week.</p>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mx-auto">
          <Form onSubmit={onSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Meal Plan Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="recipes" className="addrecipebutton">
              <Button variant="info" onClick={() => setShowModal(true)}>
                Add Recipes
              </Button>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {current ? 'Update Meal Plan' : 'Add Meal Plan'}
            </Button>
          </Form>
        </Col>
      </Row>
      <Row>
        {mealPlans.map((mealPlan) => (
          <Col key={mealPlan._id} md={4} className="mt-4">
            <Card className="meal-plan-card">
              <Card.Body>
                <Card.Title>{mealPlan.name}</Card.Title>
                <Card.Text>
                  <ListGroup>
                    {mealPlan.recipes.map((recipe) => (
                      <ListGroup.Item key={recipe._id}>
                        {recipe.title}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Text>
                <Button variant="danger" onClick={() => onDelete(mealPlan._id)}>
                  Delete
                </Button>
                <Button variant="warning" className="ml-2" onClick={() => onEdit(mealPlan)}>
                  Edit
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <RecipeModal
        show={showModal}
        onHide={() => setShowModal(false)}
        recipes={recipes}
        selectedRecipes={formData.selectedRecipes}
        onSelect={handleSelectedRecipes}
      />
    </Container>
  );
};

export default MealPlanner;
