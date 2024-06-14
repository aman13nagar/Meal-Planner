import {
    GET_MEALPLANS,
    ADD_MEALPLAN,
    DELETE_MEALPLAN,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_MEALPLAN,
    MEALPLAN_ERROR,
  } from '../types';
  
  const mealPlanReducer = (state, action) => {
    switch (action.type) {
      case GET_MEALPLANS:
        return {
          ...state,
          mealPlans: action.payload,
        };
      case ADD_MEALPLAN:
        return {
          ...state,
          mealPlans: [...state.mealPlans, action.payload],
        };
      case DELETE_MEALPLAN:
        return {
          ...state,
          mealPlans: state.mealPlans.filter((mealPlan) => mealPlan._id !== action.payload),
        };
      case UPDATE_MEALPLAN:
        return {
          ...state,
          mealPlans: state.mealPlans.map((mealPlan) =>
            mealPlan._id === action.payload._id ? action.payload : mealPlan
          ),
        };
      case SET_CURRENT:
        return {
          ...state,
          current: action.payload,
        };
      case CLEAR_CURRENT:
        return {
          ...state,
          current: null,
        };
      case MEALPLAN_ERROR:
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default mealPlanReducer;
  
  