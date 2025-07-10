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
            `SELECT 
                a.*,
                u.name, u.email, u.age, u.role, u.password_hash,
                at.*
            FROM accounts a 
            INNER JOIN users u ON a.user_id = u.id 
            INNER JOIN account_types at ON a.account_type_id = at.id 
            WHERE a.account_number = $1`,
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

        const isPasswordValid = await bcrypt.compare(password, account.password_hash);
        if (!isPasswordValid){
            res.status(401).json({message: 'Invalid account_number or password!'})
            return;
        }

        const token = jwt.sign(
            {
                account: {
                    id: account.id,
                    balance: account.balance,
                    account_number: account.account_number,
                    status: account.status
                },
                user: {
                    name: account.name,
                    email: account.email,
                    age: account.age,
                    role: account.role
                },
                account_type: {
                    type: account.type,
                    daily_withdrawal_limit: account.daily_withdrawal_limit,
                    daily_transfer_limit: account.daily_transfer_limit
                }
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            account:{
                id: account.id,
                balance: account.balance,
                account_number: account.account_number,
                status: account.status,
                user:{
                    name: account.name,
                    email: account.email,
                    age: account.age,
                    role: account.role
                },
                account_type:{
                    type: account.type,
                    daily_withdrawal_limit: account.daily_withdrawal_limit,
                    daily_transfer_limit: account.daily_transfer_limit
                }
            }
        });
    }catch(error){
        res.status(500).json({
            message: 'Error during login',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}