import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);

  // frontend/src/components/Quiz.jsx
  useEffect(() => {
    console.log("Iniciando fetch para quiz ID:", id);
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${id}`
        );
        console.log("Datos recibidos:", response.data);
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError("Error al cargar el cuestionario");
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !selectedAnswer) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleAnswerSubmit();
    }
  }, [timeLeft, selectedAnswer, handleAnswerSubmit]);

  const handleAnswerSubmit = useCallback((answerIndex) => {
    if (answerIndex === quiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setSelectedAnswer(answerIndex);
    setShowResults(true);
    setTimeout(() => {
      setShowResults(false);
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(10);
        setSelectedAnswer(null);
      } else {
        navigate(`/results/${score}`);
      }
    }, 2000);
  }, [currentQuestion, quiz, score, navigate]);

  const getAnswerClasses = (answer, index) => {
    const base = 'p-4 rounded-lg text-left transition-all';
    if (!selectedAnswer && !showResults) return `${base} bg-gray-700 hover:bg-gray-600`;
    
    const isCorrect = index === quiz.questions[currentQuestion].correctAnswer;
    const isSelected = index === selectedAnswer;
    
    if (showResults) {
      if (isCorrect) return `${base} bg-green-600 text-white`;
      if (isSelected && !isCorrect) return `${base} bg-red-600 text-white`;
      return `${base} bg-gray-700`;
    }
    
    return isSelected ? `${base} bg-blue-600 text-white` : `${base} bg-gray-700`;
  };

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (!quiz) {
    return <div className="text-center mt-8">Cargando cuestionario...</div>;
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-8">
          <div className="text-xl">
            Pregunta {currentQuestion + 1} de {quiz.questions.length}
          </div>
          <div className="text-xl">Tiempo: {timeLeft}s</div>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center">
          {currentQ.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQ.answers.map((answer, index) => (
            <button
              key={`answer-${currentQ.id}-${index}`}
              onClick={() => !selectedAnswer && handleAnswerSubmit(index)}
              className={getAnswerClasses(answer, index)}
              disabled={selectedAnswer !== null}
            >
              {answer}
            </button>
          ))}
        </div>

        <div className="mt-8 text-center text-xl">
          Puntuación actual: {score}
        </div>
      </div>
    </div>
  );
}
