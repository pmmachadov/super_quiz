import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Quiz.css';

export default function Quiz() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/api/quizzes/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar el cuestionario');
                }
                return response.json();
            })
            .then(data => {
                setQuiz(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [id]);

    if (error) {
        return (
            <div className="page-container">
                <div className="container">
                    <div className="alert alert-danger">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page-container flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    const handleAnswerSelect = (answerIndex) => {
        setSelectedAnswer(answerIndex);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer === quiz.questions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }
        setSelectedAnswer(null);
        
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResults(false);
        setScore(0);
    };

    if (!quiz) return null;

    return (
        <div className="page-container">
            <div className="container">
                <div className="section">
                    <div className="quiz-container">
                        <h1 className="text-4xl font-bold text-white mb-8">{quiz.title}</h1>
                        
                        {!showResults ? (
                            <>
                                <div className="quiz-progress">
                                    <div className="text-white">
                                        Pregunta {currentQuestion + 1} de {quiz.questions.length}
                                    </div>
                                    <div className="quiz-progress-bar">
                                        <div 
                                            className="quiz-progress-filled" 
                                            style={{ 
                                                width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` 
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="quiz-question">
                                    {quiz.questions[currentQuestion].question}
                                </div>

                                <div className="quiz-options">
                                    {quiz.questions[currentQuestion].options.map((option, index) => (
                                        <div
                                            key={index}
                                            className={`quiz-option ${
                                                selectedAnswer !== null 
                                                    ? (index === quiz.questions[currentQuestion].correctAnswer 
                                                        ? 'correct' 
                                                        : index === selectedAnswer 
                                                            ? 'wrong' 
                                                            : 'disabled') 
                                                    : ''
                                            }`}
                                            onClick={() => handleAnswerSelect(index)}
                                            style={{
                                                cursor: selectedAnswer !== null ? 'default' : 'pointer'
                                            }}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8">
                                    {selectedAnswer !== null && (
                                        <button
                                            onClick={handleNextQuestion}
                                            className="btn btn-primary w-full"
                                        >
                                            {currentQuestion < quiz.questions.length - 1
                                                ? 'Siguiente Pregunta'
                                                : 'Ver Resultados'}
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="quiz-results">
                                <h2 className="text-3xl font-bold text-white mb-6">
                                    ¡Has terminado!
                                </h2>
                                <div className="quiz-score">
                                    Puntuación: {score} de {quiz.questions.length}
                                </div>
                                <button
                                    onClick={restartQuiz}
                                    className="btn btn-primary w-full"
                                >
                                    Volver a intentar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
