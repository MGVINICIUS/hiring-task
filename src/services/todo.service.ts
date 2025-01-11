import { TodoEntity } from "../entities/todo.entity";
import { AppDataSouce } from "../db";
import { UserEntity } from "../entities";

export const createTodo = async (data: {
  title: string;
  description?: string;
  dueDate?: Date;
  user: UserEntity;
}) => {
  const todoRepository = AppDataSouce.getRepository(TodoEntity);
  const todo = todoRepository.create({
    ...data,
    completed: false,
  });
  await todoRepository.save(todo);
  return todo;
};

export const getUserTodos = async (userId: string) => {
  const todoRepository = AppDataSouce.getRepository(TodoEntity);
  return await todoRepository.find({
    where: { user: { uuid: userId } },
    order: { createdAt: "DESC" },
  });
};

export const updateTodo = async (
  todoId: string,
  userId: string,
  data: Partial<TodoEntity>
) => {
  const todoRepository = AppDataSouce.getRepository(TodoEntity);
  const todo = await todoRepository.findOne({
    where: { uuid: todoId, user: { uuid: userId } },
  });
  if (!todo) return null;
  
  Object.assign(todo, data);
  await todoRepository.save(todo);
  return todo;
};

export const deleteTodo = async (todoId: string, userId: string) => {
  const todoRepository = AppDataSouce.getRepository(TodoEntity);
  const todo = await todoRepository.findOne({
    where: { uuid: todoId, user: { uuid: userId } },
  });
  if (!todo) return false;
  
  await todoRepository.softDelete(todoId);
  return true;
};

export const todoService = {
  createTodo,
  getUserTodos,
  updateTodo,
  deleteTodo,
};

