import { Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../database/connection';
import { AccountAuthRequest } from '../middleware/accountMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || '';

export class TransactionsController {
  static withdrawal = async (req: AccountAuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.account) {
        res.status(400).json({ error: 'Account information is missing.' });
        return;
      }
      const accountId = req.account.id;
      const result = await pool.query(
        `SELECT 
          a.id, a.account_type_id, a.balance, a.status
          if.withdrawal_fee
          FROM accounts a
          INNER JOIN interest_and_fees if ON a.account_type_id = if.id 
        WHERE a.id = $1`,
        [accountId]
      );
      const account = result.rows[0];

      const { withdrawal } = req.body;
      if (!withdrawal) {
        res.status(400).json({ error: 'withdrawal is missing' });
        return;
      }

      if (withdrawal === 0 || withdrawal < 0) {
        res.status(400).json({ error: 'withdrawal cannot be negative or equal to zero ' });
      }
      const fee = withdrawal * (account.withdrawal_fee / 100);
      const totalWithdrawal = withdrawal + fee;
      if (totalWithdrawal > account.balance) {
        res.status(400).json({ error: 'withdrawal is bigger than balance' });
        return;
      }

      
    } catch (error) {}
  };
}
