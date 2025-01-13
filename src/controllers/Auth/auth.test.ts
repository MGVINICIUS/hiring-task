import request from 'supertest';
import { createTestApp } from '../../test/testApp';
import { AppDataSouce } from '../../db';
import { UserEntity } from '../../entities';
import { encryptPassword } from '../../utils/encrypt';

const app = createTestApp();

describe('Auth Controller', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      const userRepo = AppDataSouce.getRepository(UserEntity);
      const hashedPassword = await encryptPassword('password123');
      const user = userRepo.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword
      });
      await userRepo.save(user);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });
  });
});