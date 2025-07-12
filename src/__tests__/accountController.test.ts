import { AccountController } from '../controllers/accountController';
import pool from '../database/connection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../database/connection');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockPool = pool as any;
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
  });
});
