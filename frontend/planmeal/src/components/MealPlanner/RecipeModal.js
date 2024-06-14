// src/components/RecipeModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';

const RecipeModal = ({ show, onHide, recipes, selectedRecipes, onSelect }) => {
  const [localSelectedRecipes, setLocalSelectedRecipes] = useState([]);

  useEffect(() => {
    setLocalSelectedRecipes(selectedRecipes);
  }, [selectedRecipes]);

  const handleRecipeChange = (e) => {
    const { value, checked } = e.target;
    setLocalSelectedRecipes((prevState) => {
      if (checked) {
        return [...prevState, value];
      } else {
        return prevState.filter((recipe) => recipe !== value);
      }
    });
  };

  const handleSave = () => {
    onSelect(localSelectedRecipes);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Recipes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {recipes.map((recipe) => (
            <ListGroup.Item key={recipe._id}>
              <input
                type="checkbox"
                value={recipe._id}
                checked={localSelectedRecipes.includes(recipe._id)}
                onChange={handleRecipeChange}
              />
              {recipe.title}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RecipeModal;

