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

    it('should be return a successfully response, with card data', async () => {
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

      mockReq.body = { card_type: 'credit' };

      const mockCard = {
        account_id: 1,
        card_number: '010-2025',
        card_type: 'credit',
        expiry_date: '07/2030',
        cvv: 345,
        created_at: 2025,
      };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      mockPool.query.mockResolvedValueOnce({ rows: [mockCard] });

      await CardController.createCard(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Card created successfully',
        card: {
          account_id: 1,
          card_number: '010-2025',
          card_type: 'credit',
          expiry_date: '07/2030',
          cvv: 345,
          created_at: 2025,
        },
      });
    });
  });
  describe('deleteCard', () => {
    it('should be return 400 if the account does not exist', async () => {
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

      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await CardController.deleteCard(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'This account does not exist' });
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

      await CardController.deleteCard(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'The account must be active for this action' });
    });

    it('should be return 400 if card_number is missing', async () => {
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

      await CardController.deleteCard(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Card_number is missing!' });
    });

    it('should be a successfully response', async () => {
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

      mockReq.body = { card_number: '010-2025' };
      const mockCard = {
        account_id: 1,
        card_number: '010-2025',
        card_type: 'credit',
        expiry_date: '07/2030',
        cvv: 345,
        created_at: 2025,
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockCard] });
      mockPool.query.mockResolvedValueOnce({ rows: [mockCard] });
      await CardController.deleteCard(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Card deleted successfully',
        card: mockCard,
      });
    });
  });

  describe('getCards', () => {
    it('should return 400 if account is missing', async () => {
      mockReq.account = undefined;

      await CardController.getCards(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Account is missing!' });
    });

    it('should return 200 and empty array if no cards found', async () => {
      mockReq.account = { id: 1 };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await CardController.getCards(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        cards: [],
        message: 'This account does not have cards',
      });
    });

    it('should return 200 and cards array if cards exist', async () => {
      mockReq.account = { id: 1 };
      const mockCards = [
        {
          account_id: 1,
          card_number: '010-2025',
          card_type: 'credit',
          expiry_date: '07/2030',
          cvv: 345,
          created_at: '2025-01-01T00:00:00Z',
        },
      ];
      mockPool.query.mockResolvedValueOnce({ rows: mockCards });

      await CardController.getCards(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        cards: mockCards,
        message: undefined,
      });
    });

    it('should return 500 if an error occurs', async () => {
      mockReq.account = { id: 1 };
      mockPool.query.mockRejectedValueOnce(new Error('DB error'));

      await CardController.getCards(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error during getting account cards',
        error: 'DB error',
      });
    });
  });
});
