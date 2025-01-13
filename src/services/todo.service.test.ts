import { todoService } from './todo.service';
import { AppDataSouce } from '../db';
import { UserEntity } from '../entities/user.entity';
import { TodoEntity } from '../entities/todo.entity';

describe('Todo Service', () => {
  let testUser: UserEntity;
  let anotherUser: UserEntity;

  beforeEach(async () => {
    // Setup test users
    const userRepo = AppDataSouce.getRepository(UserEntity);
    testUser = userRepo.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword'
    });
    anotherUser = userRepo.create({
      username: 'anotheruser',
      email: 'another@example.com',
      password: 'hashedpassword'
    });
    await userRepo.save([testUser, anotherUser]);
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const todo = await todoService.createTodo({
        title: 'Test Todo',
        description: 'Test Description',
        user: testUser
      });

      expect(todo).toBeDefined();
      expect(todo.title).toBe('Test Todo');
      expect(todo.user.uuid).toBe(testUser.uuid);
    });
  });

  describe('getUserTodos', () => {
    beforeEach(async () => {
      // Create test todos
      await todoService.createTodo({ title: 'First Todo', user: testUser });
      await todoService.createTodo({ title: 'Second Todo', user: testUser });
      await todoService.createTodo({ title: 'Another User Todo', user: anotherUser });
    });

    it('should return only user todos in correct order', async () => {
      const todos = await todoService.getUserTodos(testUser.uuid);
      
      expect(todos).toHaveLength(2);
      expect(todos[0].title).toBe('Second Todo');
      expect(todos.every(todo => todo.user.uuid === testUser.uuid)).toBe(true);
    });
  });

  describe('updateTodo', () => {
    let testTodo: TodoEntity;

    beforeEach(async () => {
      testTodo = await todoService.createTodo({
        title: 'Test Todo',
        user: testUser
      });
    });

    it('should update todo successfully', async () => {
      const updated = await todoService.updateTodo(testTodo.uuid, testUser.uuid, {
        title: 'Updated Title',
        completed: true
      });

      expect(updated!.title).toBe('Updated Title');
      expect(updated!.completed).toBe(true);
    });

    it('should return null for non-existent todo', async () => {
      const result = await todoService.updateTodo('non-existent-id', testUser.uuid, {
        title: 'Updated Title'
      });

      expect(result).toBeNull();
    });

    it('should not update todo of different user', async () => {
      const result = await todoService.updateTodo(testTodo.uuid, anotherUser.uuid, {
        title: 'Updated Title'
      });

      expect(result).toBeNull();
    });
  });

  describe('deleteTodo', () => {
    let testTodo: TodoEntity;

    beforeEach(async () => {
      testTodo = await todoService.createTodo({
        title: 'Test Todo',
        user: testUser
      });
    });

    it('should delete todo successfully', async () => {
      const result = await todoService.deleteTodo(testTodo.uuid, testUser.uuid);
      expect(result).toBe(true);

      const todos = await todoService.getUserTodos(testUser.uuid);
      expect(todos).toHaveLength(0);
    });

    it('should return false for non-existent todo', async () => {
      const result = await todoService.deleteTodo('non-existent-id', testUser.uuid);
      expect(result).toBe(false);
    });

    it('should not delete todo of different user', async () => {
      const result = await todoService.deleteTodo(testTodo.uuid, anotherUser.uuid);
      expect(result).toBe(false);
    });
  });
});