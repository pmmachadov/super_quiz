import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  validateQuiz,
  transformFormDataToApiFormat,
} from "../utils/quizValidator";
import "./CreateQuiz.css";

export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", answers: ["", "", "", ""], correctIndex: 0 },
  ]);
  const [validationErrors, setValidationErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Transform data to the format expected by the API
    const quizData = transformFormDataToApiFormat(title, questions);

    // Validate data before sending
    const validation = validateQuiz(quizData);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Clear previous errors
    setValidationErrors([]);

    try {
      const response = await fetch("http://localhost:5000/api/quizzes", {
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
        // If backend returns validation errors
        if (respData.errors) {
          const backendErrors = respData.errors.map(
            (err) => err.msg || err.message
          );
          setValidationErrors(backendErrors);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          throw new Error(respData.message || "Error creating quiz");
        }
      }
    } catch (error) {
      setValidationErrors([error.message || "Error creating quiz"]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", answers: ["", "", "", ""], correctIndex: 0 },
    ]);

    // Scroll to the new question after a short delay
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div className="form-container">
      <div className="form-title">Create New Quiz</div>
      <div className="form-description">
        Design your own quiz with multiple-choice questions. Add as many
        questions as you want!
      </div>

      {/* Display validation errors */}
      {validationErrors.length > 0 && (
        <div className="validation-errors">
          <h3>Please correct the following errors:</h3>
          <ul>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            <div key={index} className="question-group">
              <div className="question-header">
                <h3 className="question-number">Question {index + 1}</h3>
                <div className="question-actions">
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(index)}
                    className="question-action-btn"
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
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Question Text</label>
                <input
                  type="text"
                  placeholder="Write your question here"
                  value={question.text}
                  onChange={(e) => {
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
                  <div key={ansIndex} className="option-group">
                    <div
                      className="option-label"
                      data-option={`${String.fromCharCode(65 + ansIndex)}`}
                    >
                      Answer {ansIndex + 1}
                    </div>
                    <input
                      type="text"
                      placeholder={`Enter answer ${ansIndex + 1}`}
                      value={answer}
                      onChange={(e) => {
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
                        id={`correct-${index}-${ansIndex}`}
                        name={`correctAnswer-${index}`}
                        checked={question.correctIndex === ansIndex}
                        onChange={() => {
                          const newQuestions = [...questions];
                          newQuestions[index].correctIndex = ansIndex;
                          setQuestions(newQuestions);
                        }}
                      />
                      <label htmlFor={`correct-${index}-${ansIndex}`}>
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
            className="btn-primary add-question"
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Question
          </button>

          <button type="submit" className="btn-primary">
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
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
