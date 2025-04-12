import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Quizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/quizzes')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar los cuestionarios');
                }
                return response.json();
            })
            .then(data => setQuizzes(data))
            .catch(error => setError(error.message))
            .finally(() => setLoading(false));
    }, []);

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

    return (
        <div className="page-container">
            <div className="container">
                <div className="section">
                    <h1 className="text-4xl font-bold text-white mb-8">Cuestionarios Disponibles</h1>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {quizzes.map(quiz => (
                            <Link 
                                key={quiz.id}
                                to={`/quizzes/${quiz.id}`}
                                className="card hover:shadow-lg transition-all duration-300"
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-white mb-4">{quiz.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">
                                        {quiz.questions.length} preguntas
                                    </p>
                                    <button className="btn btn-primary w-full">
                                        Jugar
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
