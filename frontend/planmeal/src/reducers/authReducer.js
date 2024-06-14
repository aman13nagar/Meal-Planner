// authReducer.js

import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS,
    STOP_LOADING, // Define STOP_LOADING action type
  } from '../types';
  
  const authReducer = (state, action) => {
    switch (action.type) {
      case USER_LOADED:
        return {
          ...state,
          isAuthenticated: true,
          loading: false, // Set loading to false when user is loaded
          user: action.payload,
        };
      case REGISTER_SUCCESS:
      case LOGIN_SUCCESS:
        localStorage.setItem('token', action.payload.token);
        return {
          ...state,
          ...action.payload,
          isAuthenticated: true,
          loading: false, // Set loading to false after successful registration or login
        };
      case AUTH_ERROR:
      case REGISTER_FAIL:
      case LOGIN_FAIL:
      case LOGOUT:
        localStorage.removeItem('token');
        return {
          ...state,
          token: null,
          isAuthenticated: false,
          loading: false, // Set loading to false on authentication errors or logout
          user: null,
          error: action.payload,
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      case STOP_LOADING: // Handle STOP_LOADING action type
        return {
          ...state,
          loading: false, // Set loading to false
        };
      default:
        return state;
    }
  };
  
  export default authReducer;
  
  
  