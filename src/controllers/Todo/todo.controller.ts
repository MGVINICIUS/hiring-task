import { todoService } from "../../services/todo.service";
import { errorHandlerWrapper } from "../../utils";
import httpStatus from "http-status";

const createTodoHandler = async (req, res) => {
  const { title, description, dueDate } = req.body;
  const todo = await todoService.createTodo({
    title,
    description,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    user: req.user,
  });
  res.status(httpStatus.CREATED).json({ todo });
};

const getTodosHandler = async (req, res) => {
  const todos = await todoService.getUserTodos(req.user.uuid);
  res.json({ todos });
};

const updateTodoHandler = async (req, res) => {
  const { id } = req.params;
  const todo = await todoService.updateTodo(id, req.user.uuid, req.body);
  if (!todo) {
    res.status(httpStatus.NOT_FOUND).json({ message: "Todo not found" });
    return;
  }
  res.json({ todo });
};

const deleteTodoHandler = async (req, res) => {
  const { id } = req.params;
  const success = await todoService.deleteTodo(id, req.user.uuid);
  if (!success) {
    res.status(httpStatus.NOT_FOUND).json({ message: "Todo not found" });
    return;
  }
  res.status(httpStatus.NO_CONTENT).send();
};

export const todoController = {
  createTodo: errorHandlerWrapper(createTodoHandler),
  getTodos: errorHandlerWrapper(getTodosHandler),
  updateTodo: errorHandlerWrapper(updateTodoHandler),
  deleteTodo: errorHandlerWrapper(deleteTodoHandler),
};