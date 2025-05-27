const { body, validationResult } = require("express-validator");

const quizCreateValidationSchema = [
  body("title")
    .exists()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be text")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("questions")
    .exists()
    .withMessage("Questions are required")
    .isArray({ min: 1 })
    .withMessage("You must include at least one question"),

  body("questions.*.question")
    .exists()
    .withMessage("Question text is required")
    .isString()
    .withMessage("Question text must be a string")
    .isLength({ min: 5, max: 500 })
    .withMessage("Question must be between 5 and 500 characters"),

  body("questions.*.options")
    .exists()
    .withMessage("Options are required")
    .isArray({ min: 2, max: 4 })
    .withMessage("You must include between 2 and 4 options"),

  body("questions.*.options.*")
    .isString()
    .withMessage("Each option must be text")
    .notEmpty()
    .withMessage("Options cannot be empty"),

  body("questions.*.correctAnswer")
    .exists()
    .withMessage("The correct answer is required")
    .isInt({ min: 0 })
    .withMessage(
      "The correct answer must be an integer greater than or equal to 0"
    )
    .custom((value, { req }) => {
      const requestBody = req.body;
      if (!requestBody.questions) return true;

      const questionIndex = req.path.split(".")[1];
      if (questionIndex === undefined) return true;

      if (value >= requestBody.questions[questionIndex]?.options?.length) {
        throw new Error(
          "The correct answer index must be valid within the options array"
        );
      }

      return true;
    }),
];

const validateQuiz = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation Error",
      errors: errors.array(),
    });
  }
  next();
};

const validateQuizStructure = (req, res, next) => {
  const { title, questions } = req.body;

  if (typeof title !== "string") {
    return res.status(400).json({
      message: "Structure Error",
      errors: [{ message: "Title must be text" }],
    });
  }

  if (!Array.isArray(questions)) {
    return res.status(400).json({
      message: "Structure Error",
      errors: [{ message: "Questions must be in an array" }],
    });
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    if (
      !q.hasOwnProperty("question") ||
      !q.hasOwnProperty("options") ||
      !q.hasOwnProperty("correctAnswer")
    ) {
      return res.status(400).json({
        message: "Structure Error",
        errors: [
          { message: `Question ${i + 1} does not have the correct format` },
        ],
      });
    }

    if (
      typeof q.question !== "string" ||
      !Array.isArray(q.options) ||
      typeof q.correctAnswer !== "number"
    ) {
      return res.status(400).json({
        message: "Structure Error",
        errors: [
          {
            message: `Question ${i + 1} does not have the correct data types`,
          },
        ],
      });
    }

    if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
      return res.status(400).json({
        message: "Structure Error",
        errors: [
          {
            message: `The correct answer for question ${i + 1} is not valid`,
          },
        ],
      });
    }

    for (let j = 0; j < q.options.length; j++) {
      if (typeof q.options[j] !== "string") {
        return res.status(400).json({
          message: "Structure Error",
          errors: [
            {
              message: `Option ${j + 1} of question ${i + 1} must be text`,
            },
          ],
        });
      }
    }
  }

  next();
};

module.exports = {
  quizCreateValidationSchema,
  validateQuiz,
  validateQuizStructure,
};
