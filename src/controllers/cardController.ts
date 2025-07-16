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
        `SELECT 
          a.id, a.account_type_id, a.balance, a.status
          fees.withdrawal_fee
          FROM accounts a
          INNER JOIN interest_and_fees fees ON a. = fees.id 
        WHERE a.id = $1`,
        [accountId]
      );
    } catch (error) {}
  };
}
