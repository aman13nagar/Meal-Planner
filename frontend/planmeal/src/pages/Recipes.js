import React, { useState,useEffect } from 'react';
import {Link} from 'react-router-dom';
import { Container, Row, Col, Card, Button,Form } from 'react-bootstrap';
import { saveToLocalStorage, getFromLocalStorage,removeFromLocalStorage} from '../utils/localStorageUtil';
import axios from 'axios';
import '../assets/css/allrecipes.css'
const Recipes = () => {
  // Dummy data for recipes
  const [recipes, setRecipes]=useState([]);
  const [error,setError]=useState('');
  const [searchQuery,setSearchValue]=useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  useEffect(() => {
    const cachedRecipes = getFromLocalStorage('recipes');
    if (cachedRecipes) {
      setRecipes(cachedRecipes);
    } else {
      fetchRecipes();
    }
  },[]);
  useEffect(() => {
    if (searchQuery) {
      const filtered = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  }, [searchQuery, recipes]);
  const fetchRecipes = async () => {
    try {
      const apiKey = '49d9b371ba6c4cc98257869758c69605'; // Access the API key from environment variables
      const res = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          apiKey: apiKey,
          number: 500, // Number of recipes to fetch
          diet: 'vegetables', // Example dietary restriction, can be dynamic
          addRecipeInformation: true,
        },
      });
      setRecipes(res.data.results);
      saveToLocalStorage('recipes', res.data.results);
      setError('');
    } catch (err) {
      setError('Error fetching recipes');
      console.error(err);
    }
  };
  const handleSearch=(e)=>{
    setSearchValue(e.target.value);
  }
  return (
    <div className="recipes-page">
      <Container>
        <Form className="mb-4">
          <Form.Group controlId="formSearch">
            <Form.Control type="text" placeholder="Search recipes..." value={searchQuery} onChange={handleSearch} />
          </Form.Group>
        </Form>
        <Row>
          {filteredRecipes.map(recipe => (
            <Col md={6} lg={4} className="mb-4" key={recipe.id}>
              <Card className="recipe-card">
                <Card.Img variant="top" src={recipe.image} />
                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>
                  <Row className="btt">
                    <Link to={`/recipe/${recipe.id}`} className="btt1">
                      <Button variant="primary">View Recipe</Button>
                    </Link>
                    <Link to={`/nutrition/${recipe.id}`} className="btt2">
                      <Button variant="primary">Nutrition info</Button>
                    </Link>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Recipes;

