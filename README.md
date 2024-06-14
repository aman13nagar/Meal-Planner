# MealPlanner

## Overview
MealPlanner is a comprehensive solution designed to help users plan their meals and manage their nutritional intake effectively. It consists of two main components:
- **Backend**: Built with Node.js, Express, and MongoDB.
- **Frontend**: Built with React and Bootstrap.

## Features
- User authentication and authorization
- Meal planning and scheduling
- Nutritional information tracking
- User-friendly interface with dark mode support

## Prerequisites
- Node.js (version 14.x or higher)
- npm (version 6.x or higher)
- MongoDB (version 4.x or higher)

## Installation

### Backend
1. Clone the repository:
    ```sh
    git clone https://github.com/aman13nagar/mealplanner.git
    cd mealplanner/backend
    ```

2. Install backend dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the backend directory and add your environment variables:
    ```env
    MONGODB_URI=your-mongodb-uri
    JWT_SECRET=your-jwt-secret
    ```

4. Start the backend server:
    ```sh
    npm start
    ```

### Frontend
1. Navigate to the frontend directory:
    ```sh
    cd ../frontend
    ```

2. Install frontend dependencies:
    ```sh
    npm install
    ```

3. Start the frontend development server:
    ```sh
    npm start
    ```

## Usage
1. Register an account or log in if you already have one.
2. Start planning your meals by adding them to your schedule.
3. Track your nutritional intake through the user-friendly dashboard.

## API Endpoints
- **GET** `/api/meals`: Retrieve all meals.
- **POST** `/api/meals`: Add a new meal.
- **GET** `/api/meals/:id`: Retrieve a specific meal by ID.
- **PUT** `/api/meals/:id`: Update a specific meal by ID.
- **DELETE** `/api/meals/:id`: Delete a specific meal by ID.
- [List other endpoints with brief descriptions]

## Contributing
If you would like to contribute, please fork the repository and use a feature branch. Pull requests are welcome.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a new Pull Request

## Contact
- **Your Name**: aman13nagar
- **Email**: aman13nagar@gmail.com

## Acknowledgements
- [List any acknowledgements here]

---

Developed by [Aman Nagar], a fourth-year Computer Science student at NIT Rourkela.
