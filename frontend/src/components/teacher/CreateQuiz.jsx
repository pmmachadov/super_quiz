import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "../auth/Auth.css";
import "../auth/Dashboard.css";
import "../auth/DashboardEffects.css";

const CreateQuiz = () => {
  const { token } = useAuth();
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = optionIndex;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = index => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!quizTitle.trim()) {
      setError("Quiz title is required");
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        setError(`Question ${i + 1} is empty`);
        return;
      }

      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].trim()) {
          setError(`Option ${j + 1} for question ${i + 1} is empty`);
          return;
        }
      }
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/teacher/quizzes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: quizTitle,
            questions: questions.map(q => ({
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create quiz");
      }

      setSuccess("Quiz created successfully!");
      // Reset form or redirect
      setQuizTitle("");
      setQuestions([
        { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      ]);
    } catch (err) {
      setError(err.message || "Failed to create quiz");
    }
  };

  return (
    <div className="create-quiz-container">
      <h1>Create New Quiz</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="quizTitle">Quiz Title</label>
          <input
            type="text"
            id="quizTitle"
            value={quizTitle}
            onChange={e => setQuizTitle(e.target.value)}
            placeholder="Enter quiz title"
            required
          />
        </div>

        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="question-container"
          >
            <div className="question-header">
              <h3>Question {qIndex + 1}</h3>
              <button
                type="button"
                className="remove-question-button"
                onClick={() => handleRemoveQuestion(qIndex)}
              >
                Remove
              </button>
            </div>

            <div className="form-group">
              <label htmlFor={`question-${qIndex}`}>Question</label>
              <input
                type="text"
                id={`question-${qIndex}`}
                value={question.question}
                onChange={e => handleQuestionChange(qIndex, e.target.value)}
                placeholder="Enter question"
                required
              />
            </div>

            <div className="options-container">
              <h4>Options</h4>
              {question.options.map((option, oIndex) => (
                <div
                  key={oIndex}
                  className="option-row"
                >
                  <input
                    type="text"
                    value={option}
                    onChange={e =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                    placeholder={`Option ${oIndex + 1}`}
                    required
                  />
                  <label className="correct-option">
                    <input
                      type="radio"
                      name={`correct-answer-${qIndex}`}
                      checked={question.correctAnswer === oIndex}
                      onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                      required
                    />
                    Correct Answer
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          className="add-question-button"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>

        <button
          type="submit"
          className="submit-quiz-button"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
