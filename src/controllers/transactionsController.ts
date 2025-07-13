import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../database/connection';

const JWT_SECRET = process.env.JWT_SECRET || '';32