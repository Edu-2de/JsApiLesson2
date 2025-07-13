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
        account: mockAccount,
      });
    });
  });

  describe('registerAccount', () => {
    it('should be return 400 if User_id or Account_type_id is missing', async () => {
      mockReq.body = { user_id: 1 };

      await AccountController.registerAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User_id and Account_type_id are required' });
    });

    it('should be return 400 if User_id or Account_type_id is missing', async () => {
      mockReq.body = { account_type_id: 1 };

      await AccountController.registerAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User_id and Account_type_id are required' });
    });

    it('should be return 400 if user not exists', async () => {
      mockReq.body = { user_id: 1, account_type_id: 1 };

      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await AccountController.registerAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'This user not exists' });
    });

    it('should be return 400 if user already had an account', async () => {
      mockReq.body = { user_id: 1, account_type_id: 1 };

      const mockUser = {
        id: 1,
      };

      const mockAccount = {
        user_id: 1,
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] }).mockResolvedValueOnce({ rows: [mockAccount] });

      await AccountController.registerAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'This user already have a account' });
    });

    it('should be return 400 if type account not exists', async () => {
      mockReq.body = { user_id: 1, account_type_id: 1 };

      const mockUser = {
        id: 1,
      };

      mockPool.query
        .mockResolvedValueOnce({ rows: [mockUser] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      await AccountController.registerAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'This type not exists in table' });
    });

    it('should return success response with account data', async () => {
      mockReq.body = { user_id: 1, account_type_id: 1 };

      const mockUser = {
        id: 1,
      };

      const mockType = {
        id: 1,
      };

      const mockNewAccount = {
        id: 1,
        user_id: 1,
        account_type_id: 1,
        balance: 0.0,
        account_number: '001-12345-6',
        status: 'active',
      };

      mockPool.query
        .mockResolvedValueOnce({ rows: [mockUser] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [mockType] })
        .mockResolvedValueOnce({ rows: [mockNewAccount] });

      await AccountController.registerAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Account registered successfully',
        account: {
          id: 1,
          user_id: 1,
          account_type_id: 1,
          balance: 0.0,
          account_number: '001-12345-6',
          status: 'active',
        },
      });
    });
  });

  describe('getAccountById', () => {
    it('should be return 404 if account not exists', async () => {
      mockReq.params = { accountId: '1' };

      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await AccountController.getAccountById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Account not found' });
    });

    it('should return success response with account data', async () => {
      mockReq.params = { accountId: '1' };

      const mockAccount = {
        id: 1,
        balance: 0.0,
        account_number: '001-12345-6',
        status: 'active',
        created_at: '2025',
        name: 'Miguel',
        email: 'miguel@gmail.com',
        age: 20,
        role: 'user',
        type: 'current',
        daily_withdrawal_limit: 1000.0,
        daily_transfer_limit: 5000.0,
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount] });

      await AccountController.getAccountById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Account retrieved successfully',
        account: mockAccount,
      });
    });
  });

  describe('getAccount', () => {
    it('should be return 404 if account not exists', async () => {
      mockReq.account = { id: '1' };

      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await AccountController.getAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Account not found' });
    });

    it('should return success response with account data', async () => {
      mockReq.params = { accountId: '1' };

      const mockAccount = {
        id: 1,
        balance: 0.0,
        account_number: '001-12345-6',
        status: 'active',
        user: {
          name: 'Miguel',
          email: 'miguel@gmail.com',
          age: 20,
          role: 'user',
        },
        account_type: {
          type: 'current',
          daily_withdrawal_limit: 1000.0,
          daily_transfer_limit: 5000.0,
        },
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount] });

      await AccountController.getAccountById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Account retrieved successfully',
        account: mockAccount,
      });
    });
  });
});
