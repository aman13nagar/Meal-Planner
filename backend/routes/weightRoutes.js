
const express = require('express');
const router = express.Router();
const Weight = require('../models/Weight');
const authMiddleware=require('../middleware/authMiddleware');
router.get('/:userId',authMiddleware, async (req, res) => {
  try {
    const weights = await Weight.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(weights);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.post('/',authMiddleware, async (req, res) => {
  const { userId, weight } = req.body;
  const date=new Date().toISOString().split('T')[0];
  console.log(date,weight);
  try {
    let newWeight = await Weight.findOne({ userId, date:date });
    if(newWeight){
        newWeight.weight+=weight;
        await newWeight.save();
    }
    else{
        newWeight=new Weight({
            userId,
            weight,
            date:date
        })
        await newWeight.save();
    }
    res.json(newWeight);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});
router.delete('/:id',authMiddleware, async (req, res) => {
  try {
    await Weight.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
