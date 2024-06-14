import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import api from '../utils/api';
import authReducer from '../reducers/authReducer';
import setAuthToken from '../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from '../types';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user
  const loadUser = useCallback(async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await api.get('/auth/loadUser');
      dispatch({ type: USER_LOADED, payload: res.data });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    } finally {
      dispatch({ type: 'STOP_LOADING' });
    }
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });
      loadUser();
    } catch (err) {
      dispatch({ type: REGISTER_FAIL, payload: err.response.data.msg });
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      console.log(res.data);
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      loadUser();
    } catch (err) {
      dispatch({ type: LOGIN_FAIL, payload: err.response.data.msg });
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: CLEAR_ERRORS });
  };

  useEffect(() => {
    if (localStorage.token) {
      loadUser();
    }
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        clearErrors,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };






