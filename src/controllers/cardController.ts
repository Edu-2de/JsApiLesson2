import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../database/connection';
import { AccountAuthRequest } from '../middleware/accountMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || '';

export class CardController {
  static createCard = async (req: AccountAuthRequest, res: Response) => {
    try {
      if (!req.account) {
        res.status(400).json({ error: 'Account is missing!' });
        return;
      }
      const accountId = req.account.id;

      const result = await pool.query(
        `SELECT id, account_type_id, balance, status FROM accounts WHERE id = $1`,
        [accountId]
      );

      if (result.rows.length === 0) {
        res.status(400).json({ error: 'This account not exist' });
        return;
      }

      const account = result.rows[0];

      if(account.status !== 'active'){
        res.status(400).json({ error: 'The account must be active for this action' });
        return;
      }

    } catch (error) {}
  };
}
