import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../database/connection'

const JWT_SECRET = process.env.JWT_SECRET || '';

const loginAccount = async(req:Request, res:Response): Promise<void> =>{
    try{
        const{account_number, password} = req.body;
        if(!account_number || !password){
            res.status(400).json({message: 'account_number and password are required!'})
            return;
        }

        const result = await pool.query(
            'SELECT id, user_id, account_type_id, balance, account_number, status, created_at, update_at FROM accounts a INNER JOIN users u ON a.user_id = u.id INNER JOIN account_types at ON a.account_type_id = at.id WHERE a.account_number = $1',
            [account_number]
        )
        if (result.rows.length == 0){
            res.status(401).json({message: 'Invalid account_number or password!'})
            return;
        }
        const account = result.rows[0];

        if(account.status !== 'active'){
            res.status(401).json({message: 'Account is blocked or closed!'});
            return;
        }

        const token = jwt.sign(
            {
                id: account.id,
                type: account.
            }
        )
    }
}