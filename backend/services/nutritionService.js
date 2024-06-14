const axios = require('axios');
const config = require('config');

const apiKey = config.get('nutritionixApiKey');
const apiUrl = 'https://trackapi.nutritionix.com/v2/natural/nutrients';

const getNutritionalInfo = async (query) => {
  try {
    const response = await axios.post(apiUrl, {
      query,
    }, {
      headers: {
        'x-app-id': config.get('nutritionixAppId'),
        'x-app-key': apiKey,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching nutritional info');
  }
};

module.exports = { getNutritionalInfo };
