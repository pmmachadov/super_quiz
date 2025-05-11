# Kahoot Clone 2 (Backend)

This is the backend server for the Kahoot Clone 2 application, providing a REST API for managing quizzes, results, and analytics.

## Current Features

- **Quiz API**: Endpoints for creating, reading, updating, and deleting quizzes
- **Results Management**: Storing and retrieving match results
- **Data Analytics**: Collecting and processing game statistics
- **Data Validation**: System for validating quiz structures
- **JSON Storage**: Data persistence using JSON files

## Upcoming Backend Features

1. **Authentication System**

- JWT for session management
- Password encryption
- Role-based access control
- Password recovery

2. **Database**

- Migration to MongoDB or PostgreSQL
- Query optimization
- Indexing for fast searches
- Caching of frequently used results

3. **Advanced API**

- WebSockets for real-time gaming
- Rate limiting for protection API
- Documentation with Swagger/OpenAPI
- API Versioning

4. Media Management

- Storing images for questions
- Support for audio files
- Integration with video services
- File optimization and compression

5. Security

- CSRF and XSS protection
- Proper CORS implementation
- Auditing of user actions
- Monitoring for suspicious activity

6. Scalability

- Microservices architecture
- Docker containers
- Load balancing
- Automated deployment

## API Structure

### Quizzes

- GET /api/quizzes`: Get all quizzes
- GET /api/quizzes/:id`: Get a specific quiz
- POST /api/quizzes`: Create a new quiz
- PUT /api/quizzes/:id`: Update an existing quiz
- DELETE /api/quizzes/:id`: Delete a quiz

### Results

- `GET /api/game-results`: Get all results
- `POST /api/game-results`: Save a new result
- `GET /api/game-results/:quizId`: Get results for a specific quiz

### Analytics

- `GET /api/analytics`: Get general statistics
- `GET /api/analytics/:quizId`: Get statistics for a specific quiz

## Data Structure

### Quiz

```json
{
  "id": 1,
  "title": "Quiz Name",
  "description": "Quiz Description",
  "questions": [
    {
      "id": 1,
      "question": "Sample Question?",
      "answers": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
      "correctAnswer": 0
    }
  ]
}
```

### Game Result

```json
{
  "id": 1,
  "quizId": 1,
  "score": 5,
  "totalQuestions": 10,
  "correctAnswers": 5,
  "questionResults": [
    {
      "questionId": "quiz-0",
      "questionText": "Sample Question?",
      "selectedAnswer": 0,
      "correctAnswer": 0,
      "isCorrect": true,
      "responseTime": 8
    }
  ]
}
```

## Installation Instructions

```bash
# Install Dependencies
npm install

# Start the server in development mode
npm run dev

# Start the server in production mode
npm start
```

## Technologies Used

- Node.js
- Express
- JSON storage
- Validators
