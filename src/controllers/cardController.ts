import { Request, Response } from 'express';
import pool from '../database/connection';
import { AccountAuthRequest } from '../middleware/accountMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || '';

export class CardController {
  static createCard = async (req: AccountAuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.account) {
        res.status(400).json({ error: 'Account is missing!' });
        return;
      }
      const accountId = req.account.id;

      const result = await pool.query(`SELECT id, account_type_id, balance, status FROM accounts WHERE id = $1`, [
        accountId,
      ]);

      if (result.rows.length === 0) {
        res.status(400).json({ error: 'This account not exist' });
        return;
      }

      const account = result.rows[0];

      if (account.status !== 'active') {
        res.status(400).json({ error: 'The account must be active for this action' });
        return;
      }

      const { card_type } = req.body;
      if (!card_type) {
        res.status(400).json({ error: 'Card Type is missing' });
      }

      if (card_type != 'credit' && card_type != 'debit' && card_type != 'prepaid') {
        res.status(400).json({ error: 'This type of card not exist' });
        return;
      }

      let cvv;
      let result_cvv;
      do {
        cvv = Math.floor(Math.random() * 900) + 100;
        result_cvv = await pool.query(`SELECT cvv FROM cards WHERE cvv = $1`, [cvv]);
      } while (result_cvv.rows.length !== 0);

      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      let year = now.getFullYear();
      year += 5;
      const mesAno = `${month}/${year}`;

      const card_number = `010-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 10)}`;
      const result_card = await pool.query(
        `INSERT INTO cards (account_id, card_number, card_type, expiry_date, cvv, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *`,
        [accountId, card_number, card_type, mesAno, cvv]
      );

      res.status(201).json({
        message: 'Card created successfully',
        card: result_card.rows[0],
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error during card creation',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  static deleteCard = async (req: AccountAuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.account) {
        res.status(400).json({ error: 'Account is missing!' });
        return;
      }
      const accountId = req.account.id;

      const result = await pool.query(`SELECT id, account_type_id, balance, status FROM accounts WHERE id = $1`, [
        accountId,
      ]);

      if (result.rows.length === 0) {
        res.status(400).json({ error: 'This card does not exist' });
        return;
      }

      const account = result.rows[0];
      if (account.status !== 'active') {
        res.status(400).json({ error: 'The account must be active for this action' });
        return;
      }

      const { card_number } = req.body;
      if (!card_number) {
        res.status(400).json({ error: 'Card_number is missing!' });
        return;
      }
      const result_card_number = await pool.query(`SELECT card_number FROM cards WHERE card_number = $1`, [
        card_number,
      ]);
      if (result_card_number.rows.length === 0) {
        res.status(400).json({ error: 'This card not exists' });
        return;
      }

      const deleteCard = await pool.query(`DELETE FROM cards WHERE card_number = $1 RETURNING *`, [card_number]);

      res.status(200).json({
        message: 'Card deleted successfully',
        card: deleteCard.rows[0],
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error during card deleting',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  static getCards = async (req: AccountAuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.account) {
        res.status(400).json({ error: 'Account is missing!' });
        return;
      }
      const accountId = req.account.id;
    } catch (error) {}
  };
}
