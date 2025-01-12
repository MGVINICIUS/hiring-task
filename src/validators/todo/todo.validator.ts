import { body } from "express-validator";

const MAX_DATE = new Date(2038, 0, 19, 3, 14, 7);  // MySQL TIMESTAMP max
const MIN_DATE = new Date(1970, 0, 1);             // MySQL TIMESTAMP min

export const createTodoValidator = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").optional(),
    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Due date must be a valid date")
      .custom((value) => {
        const date = new Date(value);
        if (date < MIN_DATE || date > MAX_DATE) {
          throw new Error("Due date must be between 1970 and 2038");
        }
        return true;
      }),
  ];
};

export const updateTodoValidator = () => {
  return [
    body("title").optional(),
    body("description").optional(),
    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Due date must be a valid date")
      .custom((value) => {
        const date = new Date(value);
        if (date < MIN_DATE || date > MAX_DATE) {
          throw new Error("Due date must be between 1970 and 2038");
        }
        return true;
      }),
    body("completed").optional().isBoolean(),
  ];
};