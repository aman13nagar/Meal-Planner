import React, { useState, useContext, useEffect } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import recipeImage from '../assets/images/cala-w6ftFbPCs9I-unsplash.jpg';
import '../assets/css/AddRecipe.css';

const AddRecipe = () => {
  const { recipes, getRecipes, addRecipe, deleteRecipe, updateRecipe} = useContext(RecipeContext);

  const [recipe, setRecipe] = useState({
    title: '',
    ingredients: '',
    instructions: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [search, setSearch] = useState('');

  const { title, ingredients, instructions } = recipe;

  useEffect(() => {
    getRecipes();
  }, [getRecipes]);

  const onChange = (e) => setRecipe({ ...recipe, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    addRecipe(recipe);
    setRecipe({
      title: '',
      ingredients: '',
      instructions: '',
    });
    setModalMessage('Recipe added successfully!');
    setShowModal(true);
  };

  const handleDelete = (id) => {
    deleteRecipe(id);
    setModalMessage('Recipe deleted successfully!');
    setShowModal(true);
  };

  const handleView = (recipe) => {
    setSelectedRecipe(recipe);
    setShowViewModal(true);
  };

  const handleUpdate = (recipe) => {
    setSelectedRecipe(recipe);
    setShowUpdateModal(true);
  };

  const onUpdateSubmit = (e) => {
    e.preventDefault();
    updateRecipe(selectedRecipe);
    setShowUpdateModal(false);
    setModalMessage('Recipe updated successfully!');
    setShowModal(true);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Add a New Recipe</h1>
      <Form onSubmit={onSubmit}>
        <Form.Group controlId="title" className="mb-3">
          <Form.Label>Recipe Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={title}
            onChange={onChange}
            required
            placeholder="Enter the recipe title"
          />
        </Form.Group>
        <Form.Group controlId="ingredients" className="mb-3">
          <Form.Label>Ingredients</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="ingredients"
            value={ingredients}
            onChange={onChange}
            required
            placeholder="Enter the ingredients, separated by commas"
          />
        </Form.Group>
        <Form.Group controlId="instructions" className="mb-3">
          <Form.Label>Instructions</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="instructions"
            value={instructions}
            onChange={onChange}
            required
            placeholder="Enter the instructions"
          />
        </Form.Group>
        <div className="d-flex justify-content-between">
          <Button variant="primary" type="submit">
            Add Recipe
          </Button>
        </div>
      </Form>

      <h2 className="text-center my-4">Your Recipes</h2>
      <Form.Group controlId="search" className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search for a recipe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form.Group>
      <Row className="justify-content-center">
        {filteredRecipes.map((recipe) => (
          <Col key={recipe._id} xs={12} md={6} lg={4} className="mb-4">
            <Card className="recipe-card shadow-sm">
              <Card.Img variant="top" src={recipeImage} />
              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
                <Card.Text>{recipe.description}</Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="primary" onClick={() => handleView(recipe)}>
                    View Recipe
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(recipe._id)}>
                    Delete Recipe
                  </Button>
                </div>
                <Button
                  variant="warning"
                  className="mt-2 w-100"
                  onClick={() => handleUpdate(recipe)}
                >
                  Update Recipe
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecipe && (
            <>
              <h3>{selectedRecipe.title}</h3>
              <p><strong>Ingredients:</strong> {selectedRecipe.ingredients}</p>
              <p><strong>Instructions:</strong> {selectedRecipe.instructions}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onUpdateSubmit}>
            <Form.Group controlId="title" className="mb-3">
              <Form.Label>Recipe Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={selectedRecipe?.title || ''}
                onChange={(e) => setSelectedRecipe({ ...selectedRecipe, title: e.target.value })}
                required
                placeholder="Enter the recipe title"
              />
            </Form.Group>
            <Form.Group controlId="ingredients" className="mb-3">
              <Form.Label>Ingredients</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="ingredients"
                value={selectedRecipe?.ingredients || ''}
                onChange={(e) => setSelectedRecipe({ ...selectedRecipe, ingredients: e.target.value })}
                required
                placeholder="Enter the ingredients, separated by commas"
              />
            </Form.Group>
            <Form.Group controlId="instructions" className="mb-3">
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="instructions"
                value={selectedRecipe?.instructions || ''}
                onChange={(e) => setSelectedRecipe({ ...selectedRecipe, instructions: e.target.value })}
                required
                placeholder="Enter the instructions"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Update Recipe
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AddRecipe;

