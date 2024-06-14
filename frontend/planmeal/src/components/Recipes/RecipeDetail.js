import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import '../../assets/css/Recipies.css'
const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.post(`/recipe/${id}`);
        setRecipe(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching recipe details');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);
  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="my-4">
      <Card>
        <Card.Body>
          <Card.Title>{recipe.title}</Card.Title>
          <Card.Text>
            <strong>Ready in:</strong> {recipe.readyInMinutes} minutes<br />
            <strong>Servings:</strong> {recipe.servings}<br />
            <strong>Ingredients:</strong>
            <ul>
              {recipe.extendedIngredients.map(ingredient => (
                <li key={ingredient.id}>{ingredient.original}</li>
              ))}
            </ul>
            <strong>Instructions:</strong>
            <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
          </Card.Text>
        </Card.Body>
        <Card.Img variant="top" src={recipe.image} />
      </Card>
    </Container>
  );
};

export default RecipeDetail;

