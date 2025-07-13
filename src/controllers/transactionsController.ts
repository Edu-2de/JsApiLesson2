import { Response } from 'express';
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
          fees.withdrawal_fee
          FROM accounts a
          INNER JOIN interest_and_fees fees ON a.account_type_id = fees.id 
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
        return;
      }

      const fee = withdrawal * (account.withdrawal_fee / 100);
      const totalWithdrawal = withdrawal + fee;
      if (totalWithdrawal > account.balance) {
        res.status(400).json({ error: 'withdrawal is bigger than balance' });
        return;
      }

      const newBalance = account.balance - totalWithdrawal;
      const result1 = await pool.query(
        `UPDATE accounts SET balance = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [newBalance, accountId]
      );

      const transaction_number = `005-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 10)}`;

      const result2 = await pool.query(
        `INSERT INTO transactions (account_id, transaction_type, amount, reference_number, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *`,
        [accountId, 'withdrawal', totalWithdrawal, transaction_number]
      );

      const newBalance_result = result1.rows[0];
      const transaction = result2.rows[0];

      res.status(201).json({
        message: 'Withdrawal successfully',
        balance: newBalance_result.balance,
        transaction: transaction,
        fee: newBalance_result.withdrawal_fee,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error during withdrawal',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  static deposit = async (req: AccountAuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.account) {
        res.status(400).json({ error: 'Account information is missing.' });
        return
      }
      const accountId = req.account.id;
      const result = await pool.query(
        `SELECT 
          a.id, a.account_type_id, a.balance, a.status
          fees.withdrawal_fee
          FROM accounts a
          INNER JOIN interest_and_fees fees ON a.account_type_id = fees.id 
        WHERE a.id = $1`,
        [accountId]
      );
    } catch (error) {}
  };
}
