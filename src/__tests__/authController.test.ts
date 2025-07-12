import { AuthController } from '../controllers/authController';
import pool from '../database/connection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../database/connection');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockPool = pool as any;
const mockBcrypt = bcrypt as any;
const mockJwt = jwt as any;

describe('AuthController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: undefined,
    };

    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should be return 400 if email or password is missing', async () => {
      mockReq.body = { email: 'test@test.com' };

      await AuthController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
    });

    it('should be return 400 if email or password is missing', async () => {
      mockReq.body = { password: 'test1234' };

      await AuthController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
    });

    it('should be return 401 if user not found', async () => {
      mockReq.body = { email: 'test@test.com', password: 'test1234' };

      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await AuthController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should be return 401 if password is invalid', async () => {
      mockReq.body = { email: 'test@test.com', password: 'wrongPassword' };

      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: 'Test User',
            email: 'test@test.com',
            age: 21,
            password_hash: 'hashedPassword',
            role: 'user',
          },
        ],
      });

      mockBcrypt.compare.mockResolvedValueOnce(false);

      await AuthController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid password' });
    });

    it('should return success response with token on valid login', async () => {
      mockReq.body = { email: 'test@test.com', password: 'test1234' };

      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        age: 21,
        password_hash: 'hashedPassword',
        role: 'user',
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });
      mockBcrypt.compare.mockResolvedValueOnce(true);
      mockJwt.sign.mockReturnValue('mockedToken');

      await AuthController.login(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: 'mockedToken',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@test.com',
          age: 21,
          role: 'user',
        },
      });
    });
  });

  describe('register', () => {
    it('should be return 400 if name, email, age or password is missing', async () => {
      mockReq.body = { name: 'Miguel' };

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Name, email, age and password are required' });
    });

    it('should be return 400 if name, email, age or password is missing', async () => {
      mockReq.body = { name: 'Miguel', email: 'miguel@gmail.com' };

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Name, email, age and password are required' });
    });

    it('should be return 400 if name, email, age or password is missing', async () => {
      mockReq.body = { name: 'Miguel', email: 'miguel@gmail.com', age: 30 };

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Name, email, age and password are required' });
    });

    it('should be return 400 if name, email, age or password is missing', async () => {
      mockReq.body = { email: 'miguel@gmail.com', age: 30, password: 'miguel1234' };

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Name, email, age and password are required' });
    });

    it('should be return 400 if email has invalid format', async () => {
      mockReq.body = { name: 'Miguel', email: 'invalid-email', age: 30, password: 'miguel1234' };

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
    });

    it('should be return 400 if if the password is less than six characters', async () => {
      mockReq.body = { name: 'Miguel', email: 'email@gmail.com', age: 30, password: 'aaa' };

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Password must be at least 6 characters long' });
    });

    it('should be return 400 if the age is less than twelve or more than ninety eight years old', async () => {
      mockReq.body = { name: 'Miguel', email: 'email@gmail.com', age: 100, password: 'miguel1234' };

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Age must be between 12 and 98' });
    });

    it('should be return 400 if the user already has an account', async () => {
      mockReq.body = { name: 'Miguel', email: 'email@gmail.com', age: 30, password: 'miguel1234' };

      mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email already exists' });
    });

    it('should create user successfully', async () => {
      mockReq.body = { name: 'Miguel', email: 'email@gmail.com', age: 30, password: 'miguel1234' };
      const mockNewUser = {
        id: 1,
        name: 'Miguel',
        email: 'email@gmail.com',
        age: 30,
        role: 'user',
      };

      mockPool.query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [mockNewUser] });

      mockBcrypt.hash.mockResolvedValueOnce('hashedPassword');

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: mockNewUser,
      });
    });
  });

  describe('getUser', () => {
    it('should be return 404 if the user is not found', async () => {
      mockReq.user = { id: 1 };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await AuthController.getUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return user data', async () => {
      const mockUser = {
        id: 1,
        name: 'Miguel',
        email: 'email@gmail.com',
        age: 30,
        role: 'user',
      };

      mockReq.user = { id: 1 };
      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });

      await AuthController.getUser(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User retrieved successfully',
        user: mockUser,
      });
    });
  });

  describe('getUserById', () => {
    it('should be return 404 if the user is not found', async () => {
      mockReq.params = { userId: '1' };

      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await AuthController.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return user data', async () => {
      const mockUser = {
        id: 1,
        name: 'Miguel',
        email: 'email@gmail.com',
        age: 30,
        role: 'user',
      };

      mockReq.params = { userId: '1' };
      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });

      await AuthController.getUserById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User retrieved successfully',
        user: mockUser,
      });
    });
  });
});
