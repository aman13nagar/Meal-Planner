import React, { createContext, useReducer } from 'react';
import api from '../utils/api';
import mealPlanReducer from '../reducers/mealPlanReducer';
import {
  GET_MEALPLANS,
  ADD_MEALPLAN,
  DELETE_MEALPLAN,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_MEALPLAN,
  MEALPLAN_ERROR,
} from '../types';

export const MealPlanContext = createContext();

export const MealPlanProvider = ({ children }) => {
  const initialState = {
    mealPlans: [],
    current: null,
    error: null,
  };

  const [state, dispatch] = useReducer(mealPlanReducer, initialState);

  const getMealPlans = async () => {
    try {
      const res = await api.get('/meal-plans');
      dispatch({ type: GET_MEALPLANS, payload: res.data });
    } catch (err) {
      dispatch({ type: MEALPLAN_ERROR, payload: err.response.msg });
    }
  };

  const addMealPlan = async (mealPlan) => {

    try {
      const res = await api.post('/meal-plans', mealPlan);
      dispatch({ type: ADD_MEALPLAN, payload: res.data });
    } catch (err) {
      dispatch({ type: MEALPLAN_ERROR, payload: err.response.msg });
    }
  };

  const deleteMealPlan = async (id) => {
    try {
      await api.delete(`/meal-plans/${id}`);
      dispatch({ type: DELETE_MEALPLAN, payload: id });
    } catch (err) {
      dispatch({ type: MEALPLAN_ERROR, payload: err.response.msg });
    }
  };

  const updateMealPlan = async (mealPlan) => {

    try {
      const res = await api.put(`/meal-plans/${mealPlan._id}`, mealPlan);
      dispatch({ type: UPDATE_MEALPLAN, payload: res.data });
    } catch (err) {
      dispatch({ type: MEALPLAN_ERROR, payload: err.response.msg });
    }
  };

  const setCurrent = (mealPlan) => dispatch({ type: SET_CURRENT, payload: mealPlan });

  const clearCurrent = () => dispatch({ type: CLEAR_CURRENT });

  return (
    <MealPlanContext.Provider
      value={{
        mealPlans: state.mealPlans,
        current: state.current,
        error: state.error,
        getMealPlans,
        addMealPlan,
        deleteMealPlan,
        updateMealPlan,
        setCurrent,
        clearCurrent,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
};
