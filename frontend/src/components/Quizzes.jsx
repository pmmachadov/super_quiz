import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Quizzes.css';

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/quizzes')
      .then((response) => response.json())
      .then((data) => {
        setQuizzes(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error loading quizzes');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="quiz-container">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cuestionarios Disponibles</h1>
        <p className="text-xl text-gray-600">Selecciona un cuestionario para comenzar</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 quiz-grid">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-card">
            <h3 className="quiz-title">{quiz.title}</h3>
            <p className="question-count">
              {quiz.questions.length} preguntas
            </p>
            <button
              className="btn-primary w-full py-3 text-lg"
              onClick={() => navigate(`/quizzes/${quiz.id}`)}
            >
              Jugar ahora
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
