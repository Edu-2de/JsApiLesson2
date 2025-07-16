import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../database/connection';
import { AccountAuthRequest } from '../middleware/accountMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || '';

export class CardController {
  static createCard = async (req: AccountAuthRequest, res: Response) => {
    try{
      
    }catch(error){

    }
  }
}
