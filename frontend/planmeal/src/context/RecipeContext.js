import React, { createContext, useReducer, useCallback } from 'react';
import api from '../utils/api';
import recipeReducer from '../reducers/recipeReducer';
import {
  GET_RECIPES,
  ADD_RECIPE,
  DELETE_RECIPE,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_RECIPE,
  RECIPE_ERROR,
  CLEAR_RECIPES,
} from '../types';

export const RecipeContext = createContext();

const RecipeProvider = ({ children }) => {
  const initialState = {
    recipes: [],
    current: null,
    error: null,
  };

  const [state, dispatch] = useReducer(recipeReducer, initialState);

  // Get recipes
  const getRecipes = useCallback(async () => {
    try {
      const res = await api.get('/recipes');
      dispatch({ type: GET_RECIPES, payload: res.data });
    } catch (err) {
      dispatch({ type: RECIPE_ERROR, payload: err.response.msg });
    }
  }, []);

  // Add recipe
  const addRecipe = async (recipe) => {
    try {
      const res = await api.post('/recipes', recipe);
      dispatch({ type: ADD_RECIPE, payload: res.data });
    } catch (err) {
      dispatch({ type: RECIPE_ERROR, payload: err.response.msg });
    }
  };

  // Delete recipe
  const deleteRecipe = async (id) => {
    try {
      await api.delete(`/recipes/${id}`);
      dispatch({ type: DELETE_RECIPE, payload: id });
    } catch (err) {
      dispatch({ type: RECIPE_ERROR, payload: err.response.msg });
    }
  };

  // Update recipe
  const updateRecipe = async (recipe) => {
    try {
      const res = await api.put(`/recipes/${recipe._id}`, recipe);
      dispatch({ type: UPDATE_RECIPE, payload: res.data });
    } catch (err) {
      dispatch({ type: RECIPE_ERROR, payload: err.response.msg });
    }
  };

  // Get nutritional information
  const getNutritionalInfo = async (query) => {
    try {
      const res = await api.post('/nutrition', { query });
      return res.data;
    } catch (err) {
      throw new Error('Error fetching nutritional info');
    }
  };

  // Set current recipe
  const setCurrent = (recipe) => dispatch({ type: SET_CURRENT, payload: recipe });

  // Clear current recipe
  const clearCurrent = () => dispatch({ type: CLEAR_CURRENT });

  // Clear recipes
  const clearRecipes = () => dispatch({ type: CLEAR_RECIPES });

  return (
    <RecipeContext.Provider
      value={{
        recipes: state.recipes,
        current: state.current,
        error: state.error,
        getRecipes,
        addRecipe,
        deleteRecipe,
        updateRecipe,
        setCurrent,
        clearCurrent,
        clearRecipes,
        getNutritionalInfo,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export { RecipeProvider };




