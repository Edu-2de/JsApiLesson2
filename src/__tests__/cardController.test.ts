import { CardController } from '../controllers/cardController';
import pool from '../database/connection';
import jwt from 'jsonwebtoken';

jest.mock('../database/connection');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockPool = pool as any;
const mockJwt = jwt as any;

describe('CardController.test', () => {
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

  describe('createCard', () => {
    it('should be return 400 if account not exist', async () => {
      mockReq.account = { id: 1 };

      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await CardController.createCard(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'This account not exist' });
    });

    it('should be return 400 if the account is not active', async () => {
      mockReq.account = { id: 1 };
      const mockAccount = {
        id: 1,
        balance: 10.0,
        account_number: '001-12345-6',
        status: 'closed',
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

      await CardController.createCard(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'The account must be active for this action' });
    });

    it('should be return 400 if card type is missing', async () => {
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

      await CardController.createCard(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Card Type is missing' });
    });

    it('should be return 400 if card type not exist', async () => {
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

      mockReq.body = { card_type: 'error' };

      await CardController.createCard(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'This type of card not exist' });
    });
  });
});
