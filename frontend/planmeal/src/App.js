import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RecipeProvider } from './context/RecipeContext';
import { MealPlanProvider } from './context/MealPlanContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import MealPlanner from './pages/MealPlanner';
import Recipes from './pages/Recipes';
import Profile from './pages/Profile';
import Intro from './pages/Intro';
import MealPlannerForm from './components/MealPlanner/MealPlanForm';
import RecipeDetail from './components/Recipes/RecipeDetail';
import NutritionInfo from './components/Nutrition/NutritionInfo';
import PrivateRoute from './components/routing/PrivateRoute';
import AppLayout from './components/Layout/AppLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/main.css';
import AddRecipe from './pages/AddRecipe';
import NotFound from './pages/error404';


const App = () => {
  return (
    <AuthProvider>
      <RecipeProvider>
        <MealPlanProvider>
          <Router>
            <Routes>
              {/* Intro Routes */}
              <Route path="/intro" element={<Intro />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword/>} />

              {/* App Routes */}
              <Route path="/" element={<Navigate to="/intro" />} />
              <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard/></AppLayout></PrivateRoute>} />  
              <Route path="/meal-planner" element={<PrivateRoute><AppLayout><MealPlanner /></AppLayout></PrivateRoute>} />
              <Route path="/meal-planner-form" element={<PrivateRoute><AppLayout><MealPlannerForm/></AppLayout></PrivateRoute>}/>
              <Route path="/recipes" element={<PrivateRoute><AppLayout><Recipes /></AppLayout></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><AppLayout><Profile /></AppLayout></PrivateRoute>} />
              <Route path="/add-recipe" element={<PrivateRoute><AppLayout><AddRecipe/></AppLayout></PrivateRoute>} />
              <Route path="/recipe/:id" element={<PrivateRoute><AppLayout><RecipeDetail/></AppLayout></PrivateRoute>} />
              <Route path="/nutrition/:recipeId" element={<PrivateRoute><AppLayout><NutritionInfo/></AppLayout></PrivateRoute>} />

              <Route path="*" element={<NotFound/>} />
            </Routes>
          </Router>
        </MealPlanProvider>
      </RecipeProvider>
    </AuthProvider>
  );
};

export default App;
