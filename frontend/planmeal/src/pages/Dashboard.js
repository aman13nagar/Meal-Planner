import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Container, Row, Col, Card, ProgressBar, Button, Modal, Form, Alert, Table,Pagination,ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { Bar,Line,Pie,Radar,Bubble } from 'react-chartjs-2';
import 'chart.js/auto';
import api from '../utils/api'; 
import axios from 'axios';
import '../assets/css/Dashboard.css'; 
import ls from 'local-storage-fallback'; 

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const [caloriesData, setCaloriesData] = useState([]);
  const [nutritionOverview, setNutritionOverview] = useState({ carbs: 0, protein: 0, fat: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [alert, setAlert] = useState('');
  const [exerciseLog, setExerciseLog] = useState([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [recipeSuggestions, setRecipeSuggestions] = useState([]);
  const [hydrationData, setHydrationData] = useState([]); // Initialize as empty array
  const [amount, setAmount] = useState('');
  const [weightData, setWeightData] = useState([]);
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const [weightchartData, setWeightChartData] = useState({labels:[],datasets:[]});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentHydrationPage,setCurrentHydrationPage]=useState(1);
  const [itemsPerPage] = useState(7);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [exerciseData, setExerciseData] = useState([]);
  const [exercise, setExercise] = useState({ name: '', caloriesBurned: 0 });
  const [exerciseChartData, setExerciseChartData] = useState({labels:[],datasets:[]});
  const [currentExercisePage, setCurrentExercisePage] = useState(1);

  useEffect(() => {
    const fetchWeeklyMealPlans = async () => {
      try {
        const res = await api.get('/meal-plans/weekly');
        const weeklyMealPlans = res.data;
        const caloriesPerDay = calculateCaloriesPerDay(weeklyMealPlans);
        const nutritionOverview = calculateNutritionOverview(weeklyMealPlans);
        setCaloriesData(caloriesPerDay);
        setNutritionOverview(nutritionOverview);
      } catch (err) {
        console.error('Error fetching weekly meal plans:', err);
      }
      setIsLoading(false);
    };
    fetchRecipes();
    fetchWeeklyMealPlans();
    if(user){
      fetchHydrationEntries();
    }
    if (user) {
      fetchWeightData();
    }
    if (user) {
      fetchExerciseData();
    }
  }, [user]);


  /*------------------------------------------------------Hydration tracking------------------------------------------*/ 


  const fetchHydrationEntries = async () => {
    try {
      const res = await api.get(`/hydration/${user._id}`);
      const aggregatedData = aggregateHydrationData(res.data);
      setHydrationData(aggregatedData);
      prepareChartData(aggregatedData.slice(0, itemsPerPage)); 
    } catch (err) {
      setError('Failed to fetch hydration entries');
    }
  };
  const aggregateHydrationData = (data) => {
    const aggregated = data.reduce((acc, entry) => {
      const date = new Date(entry.date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { _id: entry._id, date, amount: entry.amount };
      } else {
        acc[date].amount = entry.amount;
      }
      return acc;
    }, {});
    return Object.values(aggregated);
  };

  const addHydrationEntry = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/hydration', { userId:user._id, amount:parseInt(amount)});
      const newHydrationData = aggregateHydrationData([...hydrationData, res.data]);
      setHydrationData(newHydrationData);
      setCurrentHydrationPage(1);
      prepareChartData(newHydrationData.slice(0, itemsPerPage)); 
      setAmount('');
      setError('');
    } catch (err) {
      setError('Failed to add hydration entry');
    }
  };

  const prepareChartData = (data) => {
    const labels = data.map(entry => new Date(entry.date).toLocaleDateString()).reverse();
    const amount = data.map(entry => entry.amount).reverse();
    setChartData({
      labels,
      datasets: [
        {
          label: 'Hydration (in ml)',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: amount,
        },
      ],
    });
  };
  const deleteHydrationEntry = async (id) => {
    try {
      await api.delete(`/hydration/${id}`);
      const newHydrationData=hydrationData.filter(entry => entry._id !== id)
      setHydrationData(newHydrationData);
      prepareChartData(newHydrationData.slice((currentHydrationPage - 1) * itemsPerPage, currentHydrationPage * itemsPerPage));
    } catch (err) {
      setError('Failed to delete hydration entry');
    }
  };
  const indexOfLastHydration= currentHydrationPage * itemsPerPage;
  const indexOfFirstHydration = indexOfLastHydration - itemsPerPage;
  const currentHydrations = hydrationData.slice(indexOfFirstHydration, indexOfLastHydration);

  // Change page
  const paginateHydration = (pageNumber) => {
    setCurrentHydrationPage(pageNumber);
    const newCurrentHydrations = hydrationData.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);
    prepareChartData(newCurrentHydrations); 
  };

/*--------------------------------------------weight tracking----------------------------------------------------------*/

  const fetchWeightData = async () => {
    try {
      const res = await api.get(`/weight/${user._id}`);
      const aggregated=aggregateWeightData(res.data);
      setWeightData(aggregated);
      prepareWeightChartData(aggregated.slice(0, itemsPerPage)); // Initially show first 'selectedRange' entries in chart
    } catch (err) {
      setError('Failed to fetch weight data');
    }
  };

  const aggregateWeightData = (data) => {
    const aggregated = data.reduce((acc, entry) => {
      const date = new Date(entry.date).toISOString().split('T')[0];
      console.log(date,entry);
      if (!acc[date]) {
        acc[date] = { _id: entry._id, date, weight: entry.weight };
      } else {
        acc[date].weight = entry.weight;
      }
      return acc;
    }, {});
    return Object.values(aggregated);
  };
  const prepareWeightChartData = (data) => {
    const labels = data.map(entry => new Date(entry.date).toLocaleDateString()).reverse();
    const weights = data.map(entry => entry.weight).reverse();
    setWeightChartData({
      labels,
      datasets: [
        {
          label: 'Weight (in Kg)',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: weights,
        },
      ],
    });
  };

  const addWeightEntry = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/weight', { userId: user._id, weight:parseInt(weight) });
      const newWeightData = aggregateWeightData([...weightData,res.data]);
      setWeightData(newWeightData);
      setCurrentPage(1);
      prepareWeightChartData(newWeightData.slice(0, itemsPerPage));
      setWeight('');
      setError('');
    } catch (err) {
      setError('Failed to add weight entry');
    }
  };

  const deleteWeightEntry = async (id) => {
    try {
      await api.delete(`/weight/${id}`);
      const newWeightData = weightData.filter(entry => entry._id !== id);
      setWeightData(newWeightData);
      prepareWeightChartData(newWeightData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    } catch (err) {
      setError('Failed to delete weight entry');
    }
  };

  const indexOfLastWeight = currentPage * itemsPerPage;
  const indexOfFirstWeight = indexOfLastWeight - itemsPerPage;
  const currentWeights = weightData.slice(indexOfFirstWeight, indexOfLastWeight);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const newCurrentWeights = weightData.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);
    prepareWeightChartData(newCurrentWeights); 
  };
  /*--------------------------------------------------Exercise Tracking--------------------------------------------------------- */

  const fetchExerciseData = async () => {
    try {
      const res = await api.get(`/exercise/${user._id}`);
      setExerciseData(res.data);
      prepareExerciseChartData(res.data.slice(0, itemsPerPage));
    } catch (err) {
      setError('Failed to fetch exercise data');
    }
  };

  const addExerciseEntry = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/exercise', { userId: user._id, ...exercise });
      const newExerciseData = [res.data, ...exerciseData];
      setExerciseData(newExerciseData);
      setCurrentExercisePage(1);
      prepareExerciseChartData(newExerciseData.slice(0, itemsPerPage));
      setExercise({ name: '', caloriesBurned: 0 });
      setError('');
    } catch (err) {
      setError('Failed to add exercise entry');
    }
  };

  const deleteExerciseEntry = async (id) => {
    try {
      await api.delete(`/exercise/${id}`);
      const newExerciseData = exerciseData.filter(entry => entry._id !== id);
      setExerciseData(newExerciseData);
      prepareExerciseChartData(newExerciseData.slice((currentExercisePage - 1) * itemsPerPage, currentExercisePage * itemsPerPage));
    } catch (err) {
      setError('Failed to delete exercise entry');
    }
  };

  const prepareExerciseChartData = (data) => {
    const labels = data.map(entry => new Date(entry.date).toLocaleDateString()).reverse();
    const calories = data.map(entry => entry.caloriesBurned).reverse();
    setExerciseChartData({
      labels,
      datasets: [
        {
          label: 'Calories Burned',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: calories,
        },
      ],
    });
  };

  const indexOfLastExercise = currentExercisePage * itemsPerPage;
  const indexOfFirstExercise = indexOfLastExercise - itemsPerPage;
  const currentExercises = exerciseData.slice(indexOfFirstExercise, indexOfLastExercise);

  const paginateExercise = (pageNumber) => {
    setCurrentExercisePage(pageNumber);
    const newCurrentExercises = exerciseData.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);
    prepareExerciseChartData(newCurrentExercises); 
  };

  /*--------------------------------------------------Statistics---------------------------------------------------------------- */

  const calculateCaloriesPerDay = (weeklyMealPlans) => {
    const caloriesPerDay = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    weeklyMealPlans.forEach((mealPlan) => {
      const date = new Date(mealPlan.date);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const totalCalories =
        (parseFloat(mealPlan.nutritionalData.breakfast?.calories) || 0) +
        (parseFloat(mealPlan.nutritionalData.lunch?.calories) || 0) +
        (parseFloat(mealPlan.nutritionalData.dinner?.calories) || 0);

      caloriesPerDay[day] += totalCalories; // Use += to handle multiple entries per day
    });

    return Object.values(caloriesPerDay);
  };

  const calculateNutritionOverview = (weeklyMealPlans) => {
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCalories = 0;

    weeklyMealPlans.forEach((mealPlan) => {
      const meals = ['breakfast', 'lunch', 'dinner'];
      meals.forEach((meal) => {
        totalCarbs += parseFloat(mealPlan.nutritionalData[meal]?.carbs || 0);
        totalProtein += parseFloat(mealPlan.nutritionalData[meal]?.protein || 0);
        totalFat += parseFloat(mealPlan.nutritionalData[meal]?.fat || 0);
        totalCalories += parseFloat(mealPlan.nutritionalData[meal]?.calories || 0);
      });
    });
    const carbsPercentage = ((totalCarbs * 4) / totalCalories) * 100;
    const proteinPercentage = ((totalProtein * 4) / totalCalories) * 100;
    const fatPercentage = ((totalFat * 9) / totalCalories) * 100;
    return {
      carbs: carbsPercentage.toFixed(2),
      protein: proteinPercentage.toFixed(2),
      fat: fatPercentage.toFixed(2),
    };
  };

  const data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Calories Consumed',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: caloriesData,
      },
    ],
  };
  const fetchRecipes = async (nutritionOverview) => {
    const cachedRecipes = ls.getItem('recipeSuggestions');
    if (cachedRecipes) {
      setRecipeSuggestions(JSON.parse(cachedRecipes));
    } else {
      try {
        const API_KEY = '546b5abc7a3d442bacf963272f441ac3'; 
        const res = await axios.get(`https://api.spoonacular.com/recipes/random?number=10&apiKey=${API_KEY}`);
        ls.setItem('recipeSuggestions', JSON.stringify(res.data.recipes));
        setRecipeSuggestions(res.data.recipes);
      } catch (err) {
        console.error('Error fetching recipe suggestions:', err);
      }
    }
    
  };
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feedback', { feedback });
      setAlert('Feedback submitted successfully!');
      setShowFeedbackModal(false);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setAlert('Failed to submit feedback.');
    }
  };
  const handleExerciseSubmit = async (e) => {
    e.preventDefault();
    setExerciseLog([...exerciseLog, exercise]);
    setExercise({ name: '', caloriesBurned: 0 });
    setShowExerciseModal(false);
  };
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);
  return (
    <Container className={`mt-4 ${darkMode ? 'dark-mode' : ''}`}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Row className="mb-4">
            <Col>
              <p className="text-center">Hello, {user?.name}! Here’s a quick overview of your weekly meal planning.</p>
            </Col>
            <Col className="text-right">
              <Button
                variant={darkMode ? "light" : "dark"}
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </Button>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col md={8}>
              <Card className={darkMode ? 'dark-mode' : ''}>
                <Card.Body>
                  <Card.Title>Weekly Calories Consumption</Card.Title>
                  <Bar data={data} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
            <Card className={darkMode ? 'dark-mode' : ''}>
              <Card.Body>
                <Card.Title>Nutrition Overview</Card.Title>
                <p>Carbohydrates: {isNaN(nutritionOverview.carbs) ? 0 : nutritionOverview.carbs}%</p>
                <ProgressBar 
                  now={isNaN(nutritionOverview.carbs) ? 0 : nutritionOverview.carbs} 
                  label={`${isNaN(nutritionOverview.carbs) ? 0 : nutritionOverview.carbs}%`} 
                  className="mb-2" 
                />
                <p>Proteins: {isNaN(nutritionOverview.protein) ? 0 : nutritionOverview.protein}%</p>
                <ProgressBar 
                  now={isNaN(nutritionOverview.protein) ? 0 : nutritionOverview.protein} 
                  label={`${isNaN(nutritionOverview.protein) ? 0 : nutritionOverview.protein}%`} 
                  className="mb-2" 
                />
                <p>Fats: {isNaN(nutritionOverview.fat) ? 0 : nutritionOverview.fat}%</p>
                <ProgressBar 
                  now={isNaN(nutritionOverview.fat) ? 0 : nutritionOverview.fat} 
                  label={`${isNaN(nutritionOverview.fat) ? 0 : nutritionOverview.fat}%`} 
                />
              </Card.Body>
            </Card>

            </Col>
          </Row>
          <Row className="gr-pg">
            <Col>
              <Card className={darkMode ? 'dark-mode' : ''}>
                <Card.Body>
                  <Card.Title>Weight Tracking</Card.Title>
                  <Line data={weightchartData} />
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className={darkMode ? 'dark-mode' : ''}>
                <Card.Body>
                  <Card.Title>Hydration Tracking</Card.Title>
                    <Line data={chartData} />
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className={darkMode ? 'dark-mode' : ''}>
                <Card.Body>
                  <Card.Title>Exercise Tracking</Card.Title>
                  <Line data={exerciseChartData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Card className={darkMode ? 'dark-mode' : ''}>
                <Card.Body>
                  <Card.Title>Hydration Tracker</Card.Title>
                  <Form onSubmit={addHydrationEntry} className="mb-4">
                    <Form.Group controlId="formAmount">
                      <Form.Control
                        type="number"
                        placeholder="Enter amount in ml"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required/>
                    </Form.Group>
                    <Button type="submit" variant="primary">Add Entry</Button>
                  </Form>
                  {error && <p className="text-danger">{error}</p>}
                </Card.Body>
              </Card>
            </Col>
            <Row>
              <Col>
                <Table striped bordered hover variant={darkMode ? 'dark' : 'light'}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount (ml)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentHydrations.map(entry => (
                      <tr key={entry._id}>
                        <td>{new Date(entry.date).toLocaleDateString()}</td>
                        <td>{entry.amount}</td>
                        <td>
                          <Button variant="danger" onClick={() => deleteHydrationEntry(entry._id)}>Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="pagination-container">
                  <Pagination className="pagination-scroll">
                    {Array.from({ length: Math.ceil(hydrationData.length / itemsPerPage) }, (_, index) => (
                      <Pagination.Item key={index + 1} active={index + 1 === currentHydrationPage} onClick={() => paginateHydration(index + 1)}>
                        {index + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </div>
              </Col>
            </Row>
          </Row>
          <Row>
            <Col>
              <Card className={darkMode ? 'dark-mode' : ''}>
                <Card.Body className={darkMode ? 'dark-mode' : ''}>
                  <Card.Title>Weight Tracking</Card.Title>
                  <Form onSubmit={addWeightEntry}>
                    <Form.Group controlId="weight">
                      <Form.Label>Weight (kg)</Form.Label>
                      <Form.Control
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Add Weight
                    </Button>
                  </Form>
                  {error && <p className="text-danger mt-2">{error}</p>}
                </Card.Body>
              </Card>
            </Col>
            <Row>
              <Col>
                <Table striped bordered hover variant={darkMode ? 'dark' : 'light'}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Weight (kg)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentWeights.map(entry => (
                      <tr key={entry._id}>
                        <td>{new Date(entry.date).toLocaleDateString()}</td>
                        <td>{entry.weight}</td>
                        <td>
                          <Button variant="danger" onClick={() => deleteWeightEntry(entry._id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="pagination-container">
                  <Pagination className="pagination-scroll">
                    {Array.from({ length: Math.ceil(weightData.length / itemsPerPage) }, (_, index) => (
                      <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </div>
              </Col>
            </Row>
          </Row>
          <Row>
            <Col>
              <Card className={darkMode ? 'dark-mode' : ''}>
                <Card.Body className={darkMode ? 'dark-mode' : ''}>
                  <Card.Title>Exercise Tracking</Card.Title>
                  <Form onSubmit={addExerciseEntry}>
                    <Form.Group controlId="exerciseName">
                      <Form.Label>Exercise Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={exercise.name}
                        onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="caloriesBurned">
                      <Form.Label>Calories Burned</Form.Label>
                      <Form.Control
                        type="number"
                        value={exercise.caloriesBurned}
                        onChange={(e) => setExercise({ ...exercise, caloriesBurned: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Add Exercise
                    </Button>
                  </Form>
                  {error && <p className="text-danger mt-2">{error}</p>}
                </Card.Body>
              </Card>
            </Col>
            <Row>
              <Col>
                <Table striped bordered hover variant={darkMode ? 'dark' : 'light'}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Exercise</th>
                      <th>Calories Burned</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentExercises.map((entry) => (
                      <tr key={entry._id}>
                        <td>{new Date(entry.date).toLocaleDateString()}</td>
                        <td>{entry.name}</td>
                        <td>{entry.caloriesBurned}</td>
                        <td>
                          <Button variant="danger" onClick={() => deleteExerciseEntry(entry._id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="pagination-container">
                  <Pagination className="pagination-scroll">
                    {Array.from({ length: Math.ceil(exerciseData.length / itemsPerPage) }, (_, index) => (
                      <Pagination.Item key={index + 1} active={index + 1 === currentExercisePage} onClick={() => paginateExercise(index + 1)}>
                        {index + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </div>
              </Col>
            </Row>
          </Row>
          <Row className="mb-4">
            <Col>
              <Card className={darkMode ? 'dark-mode' : ''}>
                <Card.Body>
                  <Card.Title>Tips for Healthy Eating</Card.Title>
                  <ul>
                    <li>Eat a variety of foods</li>
                    <li>Include plenty of fruits and vegetables</li>
                    <li>Stay hydrated</li>
                    <li>Limit sugar and salt intake</li>
                    <li>Maintain a balanced diet</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Card className={darkMode ? 'dark-mode' : ''}>
                <Card.Body>
                  <Card.Title>Upcoming Features</Card.Title>
                  <p>Stay tuned for these exciting new features:</p>
                  <ul>
                    <li>Custom meal plans</li>
                    <li>Integration with fitness trackers</li>
                    <li>Advanced nutritional analysis</li>
                    <li>Recipe suggestions based on your preferences</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col md={6}>
              <Card className={darkMode ? 'dark-mode' : ''}>
                <Card.Body>
                  <Card.Title>Recipe Suggestions</Card.Title>
                  <ul>
                    {recipeSuggestions.map((recipe, index) => (
                      <li key={index}>{recipe.title}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Button variant="primary" onClick={() => setShowFeedbackModal(true)}>Submit Feedback</Button>
            </Col>
          </Row>
          {alert && (
            <Row className="mb-4">
              <Col>
                <Alert variant="info">{alert}</Alert>
              </Col>
            </Row>
          )}
        </>
      )}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)} className={darkMode ? 'dark-mode' : ''}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFeedbackSubmit}>
            <Form.Group controlId="feedbackForm.ControlTextarea">
              <Form.Label>Your Feedback</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showExerciseModal} onHide={() => setShowExerciseModal(false)} className={darkMode ? 'dark-mode' : ''}>
        <Modal.Header closeButton>
          <Modal.Title>Add Exercise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleExerciseSubmit}>
            <Form.Group controlId="exerciseForm.ControlInput1">
              <Form.Label>Exercise Name</Form.Label>
              <Form.Control
                type="text"
                value={exercise.name}
                onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="exerciseForm.ControlInput2">
              <Form.Label>Calories Burned</Form.Label>
              <Form.Control
                type="number"
                value={exercise.caloriesBurned}
                onChange={(e) => setExercise({ ...exercise, caloriesBurned: parseFloat(e.target.value) })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Exercise
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Dashboard;
