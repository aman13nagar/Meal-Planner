
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NutrientSchema = new Schema({
    name: { type: String },
    amount: { type: String},
    unit: { type: String},
    percentOfDailyNeeds: { type: Number}
});
const GoodorBadSchema = new Schema({
    title: { type: String },
    amount: { type: String},
    unit: { type: String},
    percentOfDailyNeeds: { type: Number}
});

const NutritionSchema = new Schema({
    recipeId: { type: Number, ref: 'RecipeDetail', required: true },
    calories: { type: Number },
    carbs: { type: String},
    fat: { type: String},
    protein: { type: String},
    image: { type: String },
    bad: [GoodorBadSchema],
    good: [GoodorBadSchema],
    nutrients: [NutrientSchema],
    properties: [
        {
        name: { type: String},
        amount: { type: String},
        unit: { type: String }
        }
    ],
    flavonoids: [
        {
        name: { type: String},
        amount: { type: String},
        unit: { type: String }
        }
    ]
});

const Nutrition= mongoose.model('Nutrition', NutritionSchema);
module.exports=Nutrition;

