import { Router } from "express";
import { todoController } from "../controllers/Todo/todo.controller";
import { checkAuth } from "../utils/checkAuth";
import { createTodoValidator, updateTodoValidator } from "../validators/todo/todo.validator";

export const todoRouter = Router();

todoRouter.use(checkAuth);

todoRouter.post(
  "/",
  createTodoValidator(),
  todoController.createTodo
);

todoRouter.get("/", todoController.getTodos);

todoRouter.put(
  "/:id",
  updateTodoValidator(),
  todoController.updateTodo
);

todoRouter.delete("/:id", todoController.deleteTodo);
