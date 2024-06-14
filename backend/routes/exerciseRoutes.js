const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const authMiddleware=require('../middleware/authMiddleware');

router.post('/',authMiddleware, async (req, res) => {
  const { userId, name, caloriesBurned } = req.body;
  try {
    const newExercise = new Exercise({ userId, name, caloriesBurned });
    const exercise = await newExercise.save();
    res.json(exercise);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/:userId',authMiddleware, async (req, res) => {
  try {
    const exercises = await Exercise.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(exercises);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


router.delete('/:id',authMiddleware, async (req, res) => {
  try {
    await Exercise.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Exercise entry removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
