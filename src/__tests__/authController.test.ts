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

    it('should be return 402 if password is invalid', async () => {
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

      expect(mockRes.status).toHaveBeenCalledWith(402);
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
    it('should be return 400 if user_id or account_type_id is missing', async () => {
      mockReq.body = { user_id: 1 };

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User_id and Account_type_id are required' });
    });

    it('should be return 400 if user_id or account_type_id is missing', async () => {
      mockReq.body = { account_type_id: 3 };

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User_id and Account_type_id are required' });
    });
  });
});
