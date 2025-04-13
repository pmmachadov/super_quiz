import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const mockQuiz = {
      id: 1,
      title: "Programming Fundamentals Quiz",
      questions: [
        {
          question: "What is a variable?",
          answers: ["Data storage container", "Type of loop", "Math operation"],
          correctAnswer: 0,
        },
        {
          question: "Which symbol is used for comments in JavaScript?",
          answers: ["//", "#", "/*"],
          correctAnswer: 0,
        },
      ],
    };
    setQuiz(mockQuiz);
  }, [id]);

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    setSelectedAnswer(answerIndex);

    if (answerIndex === quiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  if (!quiz) return <div className="text-white p-4">Loading quiz...</div>;

  return (
    <div className="container">
      {!showResults ? (
        <div>
          <div className="quiz-container">
            <div className="header">
              <h1 className="quiz-title">{quiz.title}</h1>
              <div className="question-counter">
                Question {currentQuestion + 1}/{quiz.questions.length}
              </div>
            </div>

            <div className="question-card">
              <h2>{quiz.questions[currentQuestion].question}</h2>
              <div className="answers-grid">
                {quiz.questions[currentQuestion].answers.map((answer, i) => {
                  const isAnswerSelected = selectedAnswer === i;
                  const isCorrect = isAnswerSelected && i === quiz.questions[currentQuestion].correctAnswer;
                  let answerClass = "";
                  
                  if (isCorrect) {
                    answerClass = "correct";
                  } else if (isAnswerSelected) {
                    answerClass = "incorrect";
                  }

                  return (
                    <button
                      key={i}
                      className={`answer-button ${answerClass}`}
                      onClick={() => handleAnswerSelect(i)}
                      disabled={selectedAnswer !== null}
                    >
                      {answer}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="results-container">
          <h2>Quiz Complete!</h2>
          <p className="score-display">
            Score: {score}/{quiz.questions.length}
          </p>
          <button className="primary-button" onClick={() => navigate("/")}>
            Return Home
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
