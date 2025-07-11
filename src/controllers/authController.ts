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
        res.status(401).json({ message: 'Invalid email or password!' });
        return;
      }
      const user = result.rows[0];

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid email or password' });
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

      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          age: newUser.age,
          role: newUser.role,
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: newUser.id,
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
        message: 'Account retrieved successfully',
        account: result.rows[0],
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
      const {userId} = req.params;
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
        message: 'Account retrieved successfully',
        account: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  static getAllUsers = async(req: Request, res: Response): Promise<void> =>{
    try{
      const result = await pool.query(
        `SELECT
          u.id, u.name, u.email, u.age, u.role, u.created_at, u.update_at
          FROM users u
        ORDER BY a.created_at DESC LIMIT 50`
      )
    }catch(error){
      
    }
  }
}
