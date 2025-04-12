const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
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

// Datos de ejemplo
const QUIZZES = [
    {
        id: 1,
        title: "Matemáticas Básicas",
        questions: [
            {
                id: 1,
                question: "¿Cuánto es 2 + 2?",
                options: ["2", "3", "4", "5"],
                correctAnswer: 2
            },
            {
                id: 2,
                question: "¿Cuál es la raíz cuadrada de 16?",
                options: ["2", "4", "6", "8"],
                correctAnswer: 1
            }
        ]
    }
];

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
