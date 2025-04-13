import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateQuiz.css";

export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", answers: ["", "", "", ""], correctIndex: 0 },
  ]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          questions,
        }),
      });

      if (response.ok) {
        navigate("/quizzes");
      } else {
        throw new Error("Error creating quiz");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-title">Create New Quiz</div>
      <div className="form-description">
        Add your quiz title and questions below
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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
          {questions.map((question, index) => (
            <div key={index} className="question-group">
              <div className="question-header">
                <h3 className="question-number">Question {index + 1}</h3>
                <div className="question-actions">
                  <button
                    type="button"
                    onClick={() => {
                      if (questions.length > 1) {
                        const newQuestions = [...questions];
                        newQuestions.splice(index, 1);
                        setQuestions(newQuestions);
                      }
                    }}
                    className="question-action-btn"
                  >
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
                    <div className="option-label">Answer {ansIndex + 1}</div>
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
                        name={`correctAnswer-${index}`}
                        checked={question.correctIndex === ansIndex}
                        onChange={() => {
                          const newQuestions = [...questions];
                          newQuestions[index].correctIndex = ansIndex;
                          setQuestions(newQuestions);
                        }}
                      />
                      <label>Correct Answer</label>
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
            onClick={() =>
              setQuestions([
                ...questions,
                { text: "", answers: ["", "", "", ""], correctIndex: 0 },
              ])
            }
            className="btn-primary"
          >
            Add Question
          </button>

          <button type="submit" className="btn-primary">
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
