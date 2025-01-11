import { body } from "express-validator";

export const createTodoValidator = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").optional(),
    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Due date must be a valid date"),
  ];
};

export const updateTodoValidator = () => {
  return [
    body("title").optional(),
    body("description").optional(),
    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Due date must be a valid date"),
    body("completed").optional().isBoolean(),
  ];
};