import { TransactionsController } from '../controllers/transactionsController';
import pool from '../database/connection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../database/connection');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockPool = pool as any;
const mockBcrypt = bcrypt as any;
const mockJwt = jwt as any;

describe('TransactionsController', () => {
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

  describe('withdrawal', () => {
    it('should be return 400 if withdrawal amount is missing', async () => {
      mockReq.account = { id: 1 };
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

      mockReq.body = {};

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount] });

      await TransactionsController.withdrawal(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'withdrawal is missing' });
    });

    it('should be return 400 if the account is not active', async () => {
      mockReq.account = { id: 1 };

      const mockAccount = {
        id: 1,
        balance: 0.0,
        account_number: '001-12345-6',
        status: 'closed',
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

      await TransactionsController.withdrawal(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'The account must be active for this action' });
    });

    it('should be return 400 if withdrawal cannot be negative or equal to zero', async () => {
      mockReq.account = { id: 1 };
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

      mockReq.body = { withdrawal: -1 };

      await TransactionsController.withdrawal(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'withdrawal cannot be negative or equal to zero' });
    });

    it('should be return 400 if withdrawal is bigger than balance', async () => {
      mockReq.account = { id: 1 };
      const mockAccount = {
        id: 1,
        balance: 10.0,
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
        withdrawal_fee: 1.0,
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount] });

      mockReq.body = { withdrawal: 10.0 };

      await TransactionsController.withdrawal(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'withdrawal is bigger than balance' });
    });

    it('should return success response', async () => {
      mockReq.account = { id: 1 };
      const mockAccount = {
        id: 1,
        balance: 10.0,
        account_number: '001-12345-6',
        status: 'active',
        account_type_id: 1,
        withdrawal_fee: 1.0,
        user: {
          name: 'Miguel',
          email: 'miguel@gmail.com',
          age: 20,
          role: 'user',
        },
        account_type: {
          id: 1,
          type: 'current',
          daily_withdrawal_limit: 1000.0,
          daily_transfer_limit: 5000.0,
        },
      };

      const mockFee = {};

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount] });

      mockReq.body = { withdrawal: 5.0 };

      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            balance: 4.5,
            updated_at: '2025',
          },
        ],
      });

      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            account_id: 1,
            transaction_type: 'withdrawal',
            amount: 5.0,
            reference_number: '005-2025',
            created_at: '2025',
          },
        ],
      });

      await TransactionsController.withdrawal(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Withdrawal successfully',
        balance: 4.5,
        transaction: 'withdrawal',
        fee: 0.05,
      });
    });
  });

  describe('deposit', () => {
    it('should be return 400 if deposit is missing', async () => {
      mockReq.account = { id: 1 };
      const mockAccount = {
        id: 1,
        balance: 10.0,
        account_number: '001-12345-6',
        status: 'active',
        account_type_id: 1,
        withdrawal_fee: 1.0,
        user: {
          name: 'Miguel',
          email: 'miguel@gmail.com',
          age: 20,
          role: 'user',
        },
        account_type: {
          id: 1,
          type: 'current',
          daily_withdrawal_limit: 1000.0,
          daily_transfer_limit: 5000.0,
        },
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount] });

      await TransactionsController.deposit(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'deposit is missing' });
    });

    it('should be return 400 if the account is not active', async () => {
      mockReq.account = { id: 1 };

      const mockAccount = {
        id: 1,
        balance: 0.0,
        account_number: '001-12345-6',
        status: 'closed',
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

      await TransactionsController.deposit(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'The account must be active for this action' });
    });

    it('should be return 400 if deposit is negative or equal to zero', async () => {
      mockReq.account = { id: 1 };
      const mockAccount = {
        id: 1,
        balance: 10.0,
        account_number: '001-12345-6',
        status: 'active',
        account_type_id: 1,
        withdrawal_fee: 1.0,
        user: {
          name: 'Miguel',
          email: 'miguel@gmail.com',
          age: 20,
          role: 'user',
        },
        account_type: {
          id: 1,
          type: 'current',
          daily_withdrawal_limit: 1000.0,
          daily_transfer_limit: 5000.0,
        },
      };

      mockReq.body = { deposit: -1 };

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount] });

      await TransactionsController.deposit(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'deposit cannot be negative or equal to zero' });
    });

    it('should return success response', async () => {
      mockReq.account = { id: 1 };

      const mockAccount = {
        id: 1,
        balance: 10.0,
        account_number: '001-12345-6',
        status: 'active',
        account_type_id: 1,
        withdrawal_fee: 1.0,
        user: {
          name: 'Miguel',
          email: 'miguel@gmail.com',
          age: 20,
          role: 'user',
        },
        account_type: {
          id: 1,
          type: 'current',
          daily_withdrawal_limit: 1000.0,
          daily_transfer_limit: 5000.0,
        },
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount] });

      mockReq.body = { deposit: 50.0 };

      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            balance: 60.0,
            updated_at: 2025,
          },
        ],
      });

      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            account_id: 1,
            transaction_type: 'deposit',
            amount: 50.0,
            reference_number: '006-2025',
            created_at: '2025',
          },
        ],
      });

      await TransactionsController.deposit(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Deposit successfully',
        balance: 60.0,
        type: 'deposit',
        amount: 50.0,
      });
    });
  });

  describe('transfer', () => {
    it('should be return 404 if account is not active', async () => {
      mockReq.account = { id: 1 };

      const mockAccount = {
        id: 1,
        balance: 10.0,
        account_number: '001-12345-6',
        status: 'closed',
        account_type_id: 1,
        withdrawal_fee: 1.0,
        user: {
          name: 'Miguel',
          email: 'miguel@gmail.com',
          age: 20,
          role: 'user',
        },
        account_type: {
          id: 1,
          type: 'current',
          daily_withdrawal_limit: 1000.0,
          daily_transfer_limit: 5000.0,
        },
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount] });

      await TransactionsController.transfer(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'You need an active account to make transfers' });
    });

    it('should be return 400 if amount or account_transfer is missing', async () => {
      mockReq.account = { id: 1 };

      const mockAccount = {
        id: 1,
        balance: 10.0,
        account_number: '001-12345-6',
        status: 'active',
        account_type_id: 1,
        withdrawal_fee: 1.0,
        user: {
          name: 'Miguel',
          email: 'miguel@gmail.com',
          age: 20,
          role: 'user',
        },
        account_type: {
          id: 1,
          type: 'current',
          daily_withdrawal_limit: 1000.0,
          daily_transfer_limit: 5000.0,
        },
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount] });

      await TransactionsController.transfer(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'amount or account_transfer is missing!' });
    });

    it('should be return 400 if the account_transfer not exists', async () => {
      mockReq.account = { id: 1 };

      const mockAccount = {
        id: 1,
        balance: 10.0,
        account_number: '001-12345-6',
        status: 'active',
        account_type_id: 1,
        withdrawal_fee: 1.0,
        user: {
          name: 'Miguel',
          email: 'miguel@gmail.com',
          age: 20,
          role: 'user',
        },
        account_type: {
          id: 1,
          type: 'current',
          daily_withdrawal_limit: 1000.0,
          daily_transfer_limit: 5000.0,
        },
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount] });

      mockReq.body = { amount: 5.0, account_transfer: 2 };

      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await TransactionsController.transfer(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'This account_transfer not exists' });
    });

    it('should be return 404 if the user not have balance enough for the transference', async () => {
      mockReq.account = { id: 1 };

      const mockAccount = {
        id: 1,
        balance: 10.0,
        account_number: '001-12345-6',
        status: 'active',
        account_type_id: 1,
        transfer_fee: 0.5,
        user: {
          name: 'Miguel',
          email: 'miguel@gmail.com',
          age: 20,
          role: 'user',
        },
        account_type: {
          id: 1,
          type: 'current',
          daily_withdrawal_limit: 1000.0,
          daily_transfer_limit: 5000.0,
        },
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount] });

      mockReq.body = { amount: 30.0, account_transfer: 2 };

      const mockAccount1 = {
        id: 2,
        balance: 10.0,
        account_number: '001-14545-6',
        status: 'active',
        account_type_id: 1,
        transfer_fee: 0.5,
        user: {
          name: 'Lucas',
          email: 'lucasl@gmail.com',
          age: 20,
          role: 'user',
        },
        account_type: {
          id: 1,
          type: 'current',
          daily_withdrawal_limit: 1000.0,
          daily_transfer_limit: 5000.0,
        },
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount1] });

      await TransactionsController.transfer(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'You do not have balance enough for this transfer' });
    });

    it('should return success response', async () => {
      mockReq.account = { id: 1 };

      const mockAccount = {
        id: 1,
        balance: 10.0,
        account_number: '001-12345-6',
        status: 'active',
        account_type_id: 1,
        transfer_fee: 1.0,
        user: {
          name: 'Miguel',
          email: 'miguel@gmail.com',
          age: 20,
          role: 'user',
        },
        account_type: {
          id: 1,
          type: 'current',
          daily_withdrawal_limit: 1000.0,
          daily_transfer_limit: 5000.0,
        },
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount] });

      mockReq.body = { amount: 5.0, account_transfer: 2 };

      const mockAccount1 = {
        id: 2,
        balance: 10.0,
        account_number: '001-14545-6',
        status: 'active',
        account_type_id: 1,
        transfer_fee: 1.0,
        user: {
          name: 'Lucas',
          email: 'lucasl@gmail.com',
          age: 20,
          role: 'user',
        },
        account_type: {
          id: 1,
          type: 'current',
          daily_withdrawal_limit: 1000.0,
          daily_transfer_limit: 5000.0,
        },
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockAccount1] });

      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            balance: 4.95,
            updated_at: '2025',
          },
        ],
      });

      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            balance: 15.0,
            updated_at: '2025',
          },
        ],
      });

      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            account_id: 1,
            transaction_type: 'transfer',
            amount: 5.0,
            reference_number: '007-2025',
            created_at: '2025',
          },
        ],
      });

      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            reference_number: '007-2025',
          },
        ],
      });

      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            transaction_id: 1,
            destination_account_id: 2,
            fee: 1,
            created_at: '2025',
          },
        ],
      });

      await TransactionsController.transfer(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'transfer successfully',
        shipping_account: 1,
        destination_account: 2,
        amount: 5.0,
        fee: 1,
        shipping_account_balance: 4.95,
        destination_account_balance: 15,
      });
    });
  });
});
