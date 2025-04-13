const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const quizzesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'quizzes.json')));
const QUIZZES = quizzesData.quizzes;

app.get('/api/quizzes', (req, res) => {
    res.json(QUIZZES);
});

app.get('/api/quizzes/:id', (req, res) => {
    const quiz = QUIZZES.find(q => q.id === parseInt(req.params.id));
    if (quiz) {
        res.json(quiz);
    } else {
        res.status(404).json({ message: 'Quiz not found' });
    }
});

app.post('/api/quizzes', (req, res) => {
    const newQuiz = {
        id: QUIZZES.length + 1,
        ...req.body
    };
    QUIZZES.push(newQuiz);
    res.status(201).json(newQuiz);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
