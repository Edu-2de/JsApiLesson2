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
          INNER JOIN interest_and_fees fees ON a. = fees.id 
        WHERE a.id = $1`,
        [accountId]
      );
      const account = result.rows[0];

      if (account.status != 'active') {
        res.status(400).json({ error: 'The account must be active for this action' });
      }

      const { withdrawal } = req.body;
      if (!withdrawal) {
        res.status(400).json({ error: 'withdrawal is missing' });
        return;
      }

      if (withdrawal === 0 || withdrawal < 0) {
        res.status(400).json({ error: 'withdrawal cannot be negative or equal to zero' });
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
        `INSERT INTO transactions (account_id, transaction_type, withdrawal, reference_number, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *`,
        [accountId, 'withdrawal', totalWithdrawal, transaction_number]
      );

      const newBalance_result = result1.rows[0];
      const transaction = result2.rows[0];

      res.status(201).json({
        message: 'Withdrawal successfully',
        balance: newBalance_result.balance,
        transaction: 'withdrawal',
        fee: fee,
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
        return;
      }

      const accountId = req.account.id;

      const result = await pool.query(`SELECT id, account_type_id, balance, status FROM accounts WHERE id = $1`, [
        accountId,
      ]);
      const account = result.rows[0];

      if (account.status != 'active') {
        res.status(400).json({ error: 'The account must be active for this action' });
      }

      const { deposit } = req.body;
      if (!deposit) {
        res.status(400).json({ error: 'deposit is missing' });
        return;
      }

      if (deposit === 0 || deposit < 0) {
        res.status(400).json({ error: 'deposit cannot be negative or equal to zero' });
        return;
      }

      const newBalance = account.balance + deposit;
      const result1 = await pool.query(
        `UPDATE accounts SET balance = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [newBalance, accountId]
      );

      const updateAccount = result1.rows[0];

      const transaction_number = `006-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 10)}`;
      const result2 = await pool.query(
        `INSERT INTO transactions (account_id, transaction_type, amount, reference_number, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *`,
        [accountId, 'deposit', deposit, transaction_number]
      );

      const transition = result2.rows[0];

      res.status(201).json({
        message: 'Deposit successfully',
        balance: updateAccount.balance,
        type: transition.transaction_type,
        amount: transition.amount,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error during deposit',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  static transfer = async (req: AccountAuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.account) {
        res.status(400).json({ error: 'Account information is missing.' });
        return;
      }
      const accountId = req.account.id;

      const result = await pool.query(
        `SELECT 
          a.id, a.account_type_id, a.balance, a.status
          fees.transfer_fee
          FROM accounts a
          INNER JOIN interest_and_fees fees ON a.account_type_id = fees.id 
        WHERE a.id = $1`,
        [accountId]
      );

      const account = result.rows[0];
      if (account.status != 'active') {
        res.status(404).json({ error: 'You need an active account to make transfers' });
        return;
      }

      const { amount, account_transfer } = req.body;
      if (!amount || !account_transfer) {
        res.status(400).json({ error: 'amount or account_transfer is missing!' });
        return;
      }

      const result1 = await pool.query(`SELECT id, account_type_id, balance, status FROM accounts WHERE id = $1`, [
        account_transfer,
      ]);
      if (result1.rows.length === 0) {
        res.status(404).json({ error: 'This account_transfer not exists' });
        return;
      }

      const account1 = result1.rows[0];
      if (account1.status != 'active') {
        res.status(404).json({ error: 'This account you are trying to transfer is not active!' });
        return;
      }

      const fee = amount * (account.transfer_fee / 100);
      const amountFee = amount + fee;
      if (amountFee > account.balance) {
        res.status(404).json({ error: 'You do not have balance enough for this transfer' });
        return;
      }

      const newBalance = account.balance - amountFee;
      const result2 = await pool.query(
        `UPDATE accounts SET balance = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [newBalance, accountId]
      );

      const newBalance1 = account1.balance + amount;
      const result3 = await pool.query(
        `UPDATE accounts SET balance = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [newBalance1, account_transfer]
      );

      const transaction_number = `007-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 10)}`;
      const result4 = await pool.query(
        `INSERT INTO transactions (account_id, transaction_type, amount, reference_number, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *`,
        [accountId, 'transfer', amount, transaction_number]
      );
      const transaction_type = result4.rows[0];

      const result5 = await pool.query(`SELECT id FROM transactions WHERE reference_number = $1`, [transaction_number]);
      const transactions = result5.rows[0];
      const transaction_id = transactions.id;

      const fee_value = account.transfer_fee;
      const result6 = await pool.query(
        `INSERT INTO transfers (transaction_id, destination_account_id, fee, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *`,
        [transaction_id, account_transfer, fee_value]
      );

      res.status(201).json({
        message: 'transfer successfully',
        shipping_account: accountId,
        destination_account: account_transfer,
        amount: amount,
        fee: fee_value,
        shipping_account_balance: newBalance,
        destination_account_balance: newBalance1,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error during transfer',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
