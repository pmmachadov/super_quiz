import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateQuiz.css';

export default function CreateQuiz() {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''] }]);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const quiz = {
            title,
            questions: questions.map(q => ({
                question: q.question,
                options: q.options,
                correctAnswer: 0
            }))
        };

        try {
            const response = await fetch('http://localhost:5000/api/quizzes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quiz),
            });

            if (response.ok) {
                navigate('/quizzes');
            } else {
                throw new Error('Error al crear el cuestionario');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''] }]);
    };

    const handleRemoveQuestion = (index) => {
        if (questions.length > 1) {
            const newQuestions = [...questions];
            newQuestions.splice(index, 1);
            setQuestions(newQuestions);
        }
    };

    return (
        <div className="page-container">
            <div className="container">
                <div className="section">
                    <div className="form-container">
                        <h1 className="text-4xl font-bold text-white mb-8">Crear Cuestionario</h1>
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="form-group">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Título del Cuestionario
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="form-input w-full"
                                    placeholder="Ingresa el título del cuestionario"
                                    required
                                />
                            </div>

                            {questions.map((question, index) => (
                                <div key={index} className="space-y-6">
                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-white mb-2">
                                            Pregunta {index + 1}
                                        </label>
                                        <input
                                            type="text"
                                            value={question.question}
                                            onChange={(e) => {
                                                const newQuestions = [...questions];
                                                newQuestions[index].question = e.target.value;
                                                setQuestions(newQuestions);
                                            }}
                                            className="form-input w-full"
                                            placeholder="Ingresa la pregunta"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {question.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="form-group">
                                                <label className="block text-sm font-medium text-white mb-2">
                                                    Opción {optionIndex + 1}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => {
                                                        const newQuestions = [...questions];
                                                        newQuestions[index].options[optionIndex] = e.target.value;
                                                        setQuestions(newQuestions);
                                                    }}
                                                    className="form-input w-full"
                                                    placeholder={`Ingresa la opción ${optionIndex + 1}`}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="question-actions">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveQuestion(index)}
                                            className="btn btn-outlined text-red-500 hover:text-red-700"
                                        >
                                            Eliminar Pregunta
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleAddQuestion}
                                            className="btn btn-outlined text-green-500 hover:text-green-700"
                                        >
                                            Añadir Pregunta
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="form-btn-group">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Crear Cuestionario
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
