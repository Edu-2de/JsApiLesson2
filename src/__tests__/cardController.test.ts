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
  });
});
