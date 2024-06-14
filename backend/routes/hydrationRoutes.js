
const express = require('express');
const router = express.Router();
const Hydration = require('../models/Hydration');
const authMiddleware=require('../middleware/authMiddleware');


router.post('/', authMiddleware,async (req, res) => {
  const { userId, amount } = req.body;
  const date = new Date().toISOString().split('T')[0];
  try {
    let hydration = await Hydration.findOne({ userId, date:date });
    if (hydration) {
        hydration.amount += amount;
        await hydration.save();
    } else {
        hydration = new Hydration({
          userId,
          amount,
          date:date
        });
        await hydration.save();
    }
    console.log(hydration);
    res.json(hydration);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add hydration entry' });
  }
});

// Fetch all hydration entries for a user
router.get('/:userId',authMiddleware, async (req, res) => {
  try {
    const hydrations = await Hydration.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(hydrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hydration entries' });
  }
});

// Delete a hydration entry
router.delete('/:id',authMiddleware, async (req, res) => {
  try {
    await Hydration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hydration entry deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete hydration entry' });
  }
});

module.exports = router;
