import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../database/connection';

const JWT_SECRET = process.env.JWT_SECRET || '';

export class AuthController {
  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      const result = await pool.query(
        'SELECT id, name, email, age, password_hash, role, created_at, update_at FROM users WHERE email = $1',
        [email]
      );
      if (result.rows.length == 0) {
        res.status(401).json({ message: 'User not found' });
        return;
      }
      const user = result.rows[0];

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid password' });
        return;
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          age: user.age,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          age: user.age,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error during login',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  static register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, age, password } = req.body;
      if (!name || !email || !age || !password) {
        res.status(400).json({ message: 'Name, email, age and password are required' });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters long' });
        return;
      }

      if (age > 98 || age < 12) {
        res.status(400).json({ message: 'Age must be between 12 and 98' });
        return;
      }

      const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const result = await pool.query(
        'INSERT INTO users(name, email, age, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, age, role',
        [name, email, age, hashedPassword, 'user']
      );

      const newUser = result.rows[0];

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          age: newUser.age,
          role: newUser.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error during registration',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  static getUser = async (req: any, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;

      if (!userId) {
        res.status(404).json({ error: 'userId not found' });
        return;
      }

      const result = await pool.query(
        `SELECT
          u.id, u.name, u.email, u.age, u.role, u.created_at, u.update_at
          FROM users u
        WHERE u.id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json({
        message: 'User retrieved successfully',
        user: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  static getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(404).json({ error: 'userId not in params' });
        return;
      }

      const result = await pool.query(
        `SELECT
          u.id, u.name, u.email, u.age, u.role, u.created_at, u.update_at
          FROM users u
        WHERE u.id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json({
        message: 'User retrieved successfully',
        user: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  static getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await pool.query(
        `SELECT
          u.id, u.name, u.email, u.age, u.role, u.created_at, u.update_at
          FROM users u
        ORDER BY u.created_at DESC LIMIT 50`
      );

      if (result.rows.length === 0) {
        res.status(404).json({ message: 'No users found' });
        return;
      }

      res.json({
        message: 'Users retrieved successfully',
        users: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching accounts',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  static updateUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ error: 'userId is missing on params' });
        return;
      }

      const result = await pool.query(`SELECT * FROM users Where id = $1`, [userId]);
      if (result.rows.length === 0) {
        res.status(400).json({ error: 'this user not exists' });
        return;
      }

      const user = result.rows[0];

      const { name, email, age, password, role } = req.body;

      if (name && name === user.name) {
        res.status(400).json({ error: 'this is already the user name' });
        return;
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          res.status(400).json({ message: 'Invalid email format' });
          return;
        }

        const result_email = await pool.query(`SELECT * FROM users Where email = $1`, [email]);
        if (result_email.rows.length != 0) {
          res.status(400).json({ error: 'this email already have an account!' });
          return;
        }

        if (email === user.email) {
          res.status(400).json({ error: 'this email already belongs to this user' });
          return;
        }
      }

      if (age) {
        if (age > 98 || age < 12) {
          res.status(400).json({ message: 'Age must be between 12 and 98' });
          return;
        }

        if (age === user.age) {
          res.status(400).json({ error: 'this is already the user age' });
          return;
        }
      }

      if (password) {
        if (password.length < 6) {
          res.status(400).json({ message: 'Password must be at least 6 characters long' });
          return;
        }

        if (password === user.password) {
          res.status(400).json({ error: 'this is already the user password' });
          return;
        }
      }

      if (role && role !== 'full_access' && role !== 'limit_access' && role !== 'user') {
        res.status(400).json({ message: 'This role does not exist' });
        return;
      }

      const fields = [];
      const values = [];
      let idx = 1;

      if (name) {
        fields.push(`name = $${idx++}`);
        values.push(name);
      }

      if (email) {
        fields.push(`email = $${idx++}`);
        values.push(email);
      }

      if (age) {
        fields.push(`age = $${idx++}`);
        values.push(age);
      }

      if (password) {
        fields.push(`password_hash = $${idx++}`);
        const hashedPassword = await bcrypt.hash(password, 10);
        values.push(hashedPassword);
      }

      if (role) {
        fields.push(`role = $${idx++}`);
        values.push(role);
      }

      if (fields.length === 0) {
        res.status(400).json({ message: 'No fields to update' });
        return;
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);

      values.push(userId);

      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
      const result1 = await pool.query(query, values);

      res.json({
        message: 'User updated successfully',
        user: result1.rows[0],
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  static updateUser = async (req: any, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      if (!userId) {
        res.status(400).json({ error: 'userId is missing on params' });
        return;
      }

      const result = await pool.query(`SELECT * FROM users Where id = $1`, [userId]);
      if (result.rows.length === 0) {
        res.status(400).json({ error: 'this user not exists' });
        return;
      }

      const user = result.rows[0];

      const { name, email, age, password } = req.body;

      if (name && name === user.name) {
        res.status(400).json({ error: 'this is already the user name' });
        return;
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          res.status(400).json({ message: 'Invalid email format' });
          return;
        }

        const result_email = await pool.query(`SELECT * FROM users Where email = $1`, [email]);
        if (result_email.rows.length != 0) {
          res.status(400).json({ error: 'this email already have an account!' });
          return;
        }

        if (email === user.email) {
          res.status(400).json({ error: 'this email already belongs to this user' });
          return;
        }
      }

      if (age) {
        if (age > 98 || age < 12) {
          res.status(400).json({ message: 'Age must be between 12 and 98' });
          return;
        }

        if (age === user.age) {
          res.status(400).json({ error: 'this is already the user age' });
          return;
        }
      }

      if (password) {
        if (password.length < 6) {
          res.status(400).json({ message: 'Password must be at least 6 characters long' });
          return;
        }

        if (password === user.password) {
          res.status(400).json({ error: 'this is already the user password' });
          return;
        }
      }

      if ('role' in req.body) {
        res.status(403).json({ error: 'You cannot update your role' });
        return;
      }

      const fields = [];
      const values = [];
      let idx = 1;

      if (name) {
        fields.push(`name = $${idx++}`);
        values.push(name);
      }

      if (email) {
        fields.push(`email = $${idx++}`);
        values.push(email);
      }

      if (age) {
        fields.push(`age = $${idx++}`);
        values.push(age);
      }

      if (password) {
        fields.push(`password_hash = $${idx++}`);
        const hashedPassword = await bcrypt.hash(password, 10);
        values.push(hashedPassword);
      }

      if (fields.length === 0) {
        res.status(400).json({ message: 'No fields to update' });
        return;
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);

      values.push(userId);

      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
      const result1 = await pool.query(query, values);

      res.json({
        message: 'User updated successfully',
        user: result1.rows[0],
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  static deleteUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ error: 'userId is missing on params' });
        return;
      }

      const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'user not found in database' });
        return;
      }

      const user = result.rows[0];
      const result1 = await pool.query(`DELETE FROM users WHERE id = $1`);

      res.status(200).json({
        message: 'User deleted successfully',
        user: user,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  static deleteUser = async (req: any, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      if (!userId) {
        res.status(400).json({ error: 'userId is missing on params' });
        return;
      }

      const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'user not found in database' });
        return;
      }

      const user = result.rows[0];
      const result1 = await pool.query(`DELETE FROM users WHERE id = $1`);

      res.status(200).json({
        message: 'User deleted successfully',
        user: user,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
