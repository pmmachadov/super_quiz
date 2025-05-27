import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  transformFormDataToApiFormat,
  validateQuiz,
} from "../utils/quizValidator";
import BubbleEffect from "./BubbleEffect";
import "./CreateQuiz.css";

export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { id: "q-1", text: "", answers: ["", "", "", ""], correctIndex: 0 },
  ]);
  const [validationErrors, setValidationErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    const quizData = transformFormDataToApiFormat(title, questions);

    const validation = validateQuiz(quizData);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setValidationErrors([]);

    try {
      const response = await fetch("http://localhost:5173/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });

      const respData = await response.json();

      if (response.ok) {
        navigate("/quizzes");
      } else {
        const errorMessage = respData.errors
          ? respData.errors.map(err => err.msg || err.message)
          : [respData.message || "Error creating quiz"];

        setValidationErrors(errorMessage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      setValidationErrors([error.message || "Error creating quiz"]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRemoveQuestion = index => {
    if (questions.length > 1) {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        text: "",
        answers: ["", "", "", ""],
        correctIndex: 0,
      },
    ]);

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 300);
  };

  return (
    <div className="form-container">
      <div className="form-title">Create New Quiz</div>
      <div className="form-description">
        Design your own quiz with multiple-choice questions. Add as many
        questions as you want!
      </div>

      {validationErrors.length > 0 && (
        <div className="validation-errors">
          <h3>Please correct the following errors:</h3>
          <ul>
            {validationErrors.map((error, i) => (
              <li key={`validation-error-${i}-${error.substring(0, 10)}`}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label
            className="form-label"
            htmlFor="quiz-title"
          >
            Quiz Title
          </label>
          <input
            type="text"
            id="quiz-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="form-input"
            placeholder="Enter a descriptive title for your quiz"
            required
          />
        </div>

        <div className="questions-section">
          <div className="questions-header">
            <h3 className="questions-title">Questions</h3>
          </div>

          {questions.map((question, index) => (
            <div
              key={question.id}
              className="question-group"
            >
              <div className="question-header">
                <h3 className="question-number">Question {index + 1}</h3>
                <div className="question-actions">
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(index)}
                    className="question-action-btn multi-bubble"
                    disabled={questions.length <= 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                    Remove
                    <BubbleEffect />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor={`question-${question.id}`}
                >
                  Question Text
                </label>
                <input
                  type="text"
                  id={`question-${question.id}`}
                  placeholder="Write your question here"
                  value={question.text}
                  onChange={e => {
                    const newQuestions = [...questions];
                    newQuestions[index].text = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  className="form-input"
                  required
                />
              </div>

              <div className="options-grid">
                {question.answers.map((answer, ansIndex) => (
                  <div
                    key={`${question.id}-ans-${ansIndex}`}
                    className="option-group"
                  >
                    <label
                      className="option-label"
                      data-option={`${String.fromCharCode(65 + ansIndex)}`}
                      htmlFor={`answer-${question.id}-${ansIndex}`}
                    >
                      Answer {ansIndex + 1}
                    </label>
                    <input
                      type="text"
                      id={`answer-${question.id}-${ansIndex}`}
                      placeholder={`Enter answer ${ansIndex + 1}`}
                      value={answer}
                      onChange={e => {
                        const newQuestions = [...questions];
                        newQuestions[index].answers[ansIndex] = e.target.value;
                        setQuestions(newQuestions);
                      }}
                      className="form-input"
                      required
                    />
                    <div className="correct-answer">
                      <input
                        type="radio"
                        id={`correct-${question.id}-${ansIndex}`}
                        name={`correctAnswer-${index}`}
                        checked={question.correctIndex === ansIndex}
                        onChange={() => {
                          const newQuestions = [...questions];
                          newQuestions[index].correctIndex = ansIndex;
                          setQuestions(newQuestions);
                        }}
                      />
                      <label htmlFor={`correct-${question.id}-${ansIndex}`}>
                        Correct Answer
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="form-btn-group">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="btn-primary add-question multi-bubble"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
              ></line>
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
              ></line>
            </svg>
            Add Question
            <BubbleEffect />
          </button>

          <button
            type="submit"
            className="btn-primary multi-bubble"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Create Quiz
            <BubbleEffect />
          </button>
        </div>
      </form>
    </div>
  );
}
