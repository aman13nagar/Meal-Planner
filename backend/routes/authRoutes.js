const express = require('express');
const userController= require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/loadUser',authMiddleware,userController.getUser);

module.exports = router;

