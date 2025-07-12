import { AccountController } from '../controllers/accountController';
import pool from '../database/connection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../database/connection');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockPool = pool as any;
const mockBcrypt = bcrypt as any;
const mockJwt = jwt as any;

describe('AccountController', () => {
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

  describe('loginAccount', () => {
    it('should return 400 if account_number or password is missing', async () => {
      mockReq.body = { account_number: '001-98765-4' };

      await AccountController.loginAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'account_number and password are required!' });
    });

    it('should return 400 if account_number or password is missing', async () => {
      mockReq.body = { password: 'Miguel1234' };

      await AccountController.loginAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'account_number and password are required!' });
    });

    it('should return 401 if the account is not found', async () => {
      mockReq.body = { account_number: '001-98765-4', password: 'Miguel1234' };

      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await AccountController.loginAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid account_number or password!' });
    });

    it('should return 401 if the account blocked or closed', async () => {
      mockReq.body = { account_number: '001-98765-4', password: 'Miguel1234' };

      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            balance: 0.0,
            account_number: '002-98765-4',
            status: 'closed',
            user: {
              name: 'Test',
              email: 'test@gmail.com',
              age: 30,
              role: 'user',
            },
            account_type: {
              type: 'current',
              daily_withdrawal_limit: 1000.0,
              daily_transfer_limit: 5000.0,
            },
          },
        ],
      });

      await AccountController.loginAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Account is blocked or closed!' });
    });

    it('should return 401 if the password is not correct', async () => {
      mockReq.body = { account_number: '001-98765-4', password: 'wrongPassword' };
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            balance: 0.0,
            account_number: '002-98765-4',
            status: 'active',
            user: {
              name: 'Test',
              email: 'test@gmail.com',
              age: 30,
              role: 'user',
              password_hash: 'hashedPassword',
            },
            account_type: {
              type: 'current',
              daily_withdrawal_limit: 1000.0,
              daily_transfer_limit: 5000.0,
            },
          },
        ],
      });

      mockBcrypt.compare.mockResolvedValueOnce(false);

      await AccountController.loginAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid account_number or password!' });
    });

    it('should return success response with token on valid login', async () => {
      mockReq.body = { account_number: '001-98765-4', password: 'Miguel1234' };

      const mockAccount = {
        id: 1,
        balance: 0.0,
        account_number: '001-98765-4',
        status: 'active',
        user: {
          name: undefined,
          email: undefined,
          age: undefined,
          role: undefined,
          password_hash: undefined,
        },
        account_type: {
          type: undefined,
          daily_withdrawal_limit: undefined,
          daily_transfer_limit: undefined,
        },
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount] });

      mockBcrypt.compare.mockResolvedValueOnce(true);
      mockJwt.sign.mockReturnValueOnce('mockedToken');

      await AccountController.loginAccount(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: 'mockedToken',
        account: mockAccount
      });
    });
  });
});
