export function validateQuiz(quiz) {
  const errors = [];

  if (!quiz.title) {
    errors.push("Title is required");
  } else if (typeof quiz.title !== "string") {
    errors.push("Title must be text");
  } else if (quiz.title.length < 3 || quiz.title.length > 100) {
    errors.push("Title must be between 3 and 100 characters");
  }

  if (!quiz.questions || !Array.isArray(quiz.questions)) {
    errors.push("Questions must be in an array");
  } else if (quiz.questions.length === 0) {
    errors.push("You must include at least one question");
  } else {
    quiz.questions.forEach((q, index) => {
      if (!q.question) {
        errors.push(`Question ${index + 1} must have text`);
      } else if (typeof q.question !== "string") {
        errors.push(`Question ${index + 1} text must be text`);
      } else if (q.question.length < 5 || q.question.length > 500) {
        errors.push(
          `Question ${index + 1} text must be between 5 and 500 characters`
        );
      }

      if (!q.options || !Array.isArray(q.options)) {
        errors.push(`Options for question ${index + 1} must be in an array`);
      } else if (q.options.length < 2 || q.options.length > 4) {
        errors.push(`Question ${index + 1} must have between 2 and 4 options`);
      } else {
        q.options.forEach((opt, optIndex) => {
          if (typeof opt !== "string") {
            errors.push(
              `Option ${optIndex + 1} for question ${index + 1} must be text`
            );
          } else if (opt.trim() === "") {
            errors.push(
              `Option ${optIndex + 1} for question ${index + 1} cannot be empty`
            );
          }
        });
      }

      if (q.correctAnswer === undefined || q.correctAnswer === null) {
        errors.push(
          `You must select a correct answer for question ${index + 1}`
        );
      } else if (typeof q.correctAnswer !== "number") {
        errors.push(
          `The correct answer for question ${index + 1} must be a number`
        );
      } else if (
        q.options &&
        (q.correctAnswer < 0 || q.correctAnswer >= q.options.length)
      ) {
        errors.push(
          `The correct answer for question ${index + 1} is not valid`
        );
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function transformFormDataToApiFormat(title, questions) {
  return {
    title,
    questions: questions.map((q) => ({
      question: q.text,
      options: q.answers,
      correctAnswer: q.correctIndex,
    })),
  };
}

export function transformApiDataToFormFormat(apiQuiz) {
  return {
    title: apiQuiz.title,
    questions: apiQuiz.questions.map((q) => ({
      text: q.question,
      answers: q.options,
      correctIndex: q.correctAnswer,
    })),
  };
}
