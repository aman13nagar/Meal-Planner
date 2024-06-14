const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const userRoutes = require('./routes/userRoutes');
const nutritionRoutes=require('./routes/nutritionRoutes');
const recipeDetailRoutes=require('./routes/recipeDetailRoutes');
const hydrationRoutes=require('./routes/hydrationRoutes');
const weightRoutes=require('./routes/weightRoutes');
const exerciseRoutes=require('./routes/exerciseRoutes');
const passwordRoutes=require('./routes/passwordRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes',recipeRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/nutritions', nutritionRoutes);
app.use('/api/recipe',recipeDetailRoutes);
app.use('/api/hydration',hydrationRoutes);
app.use('/api/weight',weightRoutes);
app.use('/api/exercise',exerciseRoutes);
app.use('/api/password',passwordRoutes);

mongoose.connect("mongodb+srv://aman13nagar:MvuudGm2Z0LsjwIY@cluster0.e3nardl.mongodb.net/MealPlanner", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Start server
app.get('/',(req,res)=>{
    res.send('server started')
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


