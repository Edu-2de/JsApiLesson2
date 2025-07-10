import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../database/connection";

const JWT_SECRET = process.env.JWT_SECRET || "";

export class AccountController {
    static loginAccount = async (req: Request, res: Response): Promise<void> => {
        try {
            const { account_number, password } = req.body;
            if (!account_number || !password) {
                res
                .status(400)
                .json({ message: "account_number and password are required!" });
                return;
            }

            const result = await pool.query(
                `SELECT 
                            a.*,
                            u.*,
                            at.*
                        FROM accounts a 
                        INNER JOIN users u ON a.user_id = u.id 
                        INNER JOIN account_types at ON a.account_type_id = at.id 
                        WHERE a.account_number = $1`,
                [account_number]
            );
            if (result.rows.length == 0) {
                res
                .status(401)
                .json({ message: "Invalid account_number or password!" });
                return;
            }
            const account = result.rows[0];

            if (account.status !== "active") {
                res.status(401).json({ message: "Account is blocked or closed!" });
                return;
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                account.password_hash
            );
            if (!isPasswordValid) {
                res
                .status(401)
                .json({ message: "Invalid account_number or password!" });
                return;
            }

            const accountData = {
                id: account.id,
                balance: account.balance,
                account_number: account.account_number,
                status: account.status,
                user: {
                name: account.name,
                email: account.email,
                age: account.age,
                role: account.role,
                },
                account_type: {
                type: account.type,
                daily_withdrawal_limit: account.daily_withdrawal_limit,
                daily_transfer_limit: account.daily_transfer_limit,
                },
            };

            const token = jwt.sign(accountData, JWT_SECRET, { expiresIn: "24h" });
            res.json({
                message: "Login successful",
                token,
                account: accountData,
            });
        }catch (error) {
        res.status(500).json({
            message: "Error during login",
            error: error instanceof Error ? error.message : String(error)});
        }
    };


    static registerAccount = async (req: Request, res: Response ): Promise<void> => {
        try {
            const { user_id, account_type_id } = req.body;
            if (!user_id || !account_type_id) {
                res
                .status(400)
                .json({ message: "User_id and Account_type_id are required" });
                return;
            }

            const existingUser = await pool.query(
                `SELECT id FROM users WHERE id = $1`,
                [user_id]
            );
            if (existingUser.rows.length === 0) {
                res.status(400).json({ message: "This user not exists" });
                return;
            }

            const existingAccountUser = await pool.query(
                `SELECT user_id FROM accounts WHERE user_id = $1`,
                [user_id]
            );
            if (existingAccountUser.rows.length > 0) {
                res.status(400).json({ message: "This user already have a account" });
                return;
            }

            const existingType = await pool.query(
                `SELECT id from account_types WHERE id = $1`,
                [account_type_id]
            );
            if (existingType.rows.length === 0) {
                res.status(400).json({ message: "This type not exists in table" });
                return;
            }

            const account_number = `001-${Date.now()
                .toString()
                .slice(-5)}-${Math.floor(Math.random() * 10)}`;
            const result = await pool.query(
                `INSERT INTO accounts(user_id, account_type_id, account_number) VALUES ($1, $2, $3)
                        RETURNING id, user_id, account_type_id, balance, account_number, status`,
                [user_id, account_type_id, account_number]
            );

            const newAccount = result.rows[0];

            res.status(201).json({
                message: "Account registered successfully",
                account: {
                id: newAccount.id,
                user_id: newAccount.user_id,
                account_type_id: newAccount.account_type_id,
                balance: newAccount.balance,
                account_number: newAccount.account_number,
                status: newAccount.status,
                },
            });
        } catch (error) {
        res.status(500).json({
            message: "Error during account registration",
            error: error instanceof Error ? error.message : String(error)});
        }
    };


    static getAccount = async(req: any, res:Response): Promise<void> =>{
        try{
            const accountId = req.account.id;
            const result = await pool.query(
                `SELECT 
                    a.*,
                    u.*,
                    at.*
                    FROM accounts a 
                    INNER JOIN users u ON a.user_id = u.id 
                    INNER JOIN account_types at ON a.account_type_id = at.id 
                WHERE a.id = $1`,
                [accountId]
            );

            if(result.rows.length === 0){
                res.status(404).json({message: 'Account not found'});
                return;
            }

            res.json({
                message: 'Account retrieved succesfully',
                account: result.rows[0]
            });
        }catch(error){
            res.status(500).json({
                message: 'Error fetching account',
                error: error instanceof Error ? error.message : String(error)
            });
        }
    };


    static updateAccountAdmin = async(req: Request, res:Response): Promise<void> =>{
        try{
            const {accountId} = req.params;
            const check = await pool.query(
                `SELECT 
                    a.*,
                    u.*,
                    at.*
                    FROM accounts a 
                    INNER JOIN users u ON a.user_id = u.id 
                    INNER JOIN account_types at ON a.account_type_id = at.id 
                WHERE a.id = $1`,
                [accountId]
            );

            if(check.rows.length === 0){
                res.status(404).json({message: 'Account not found'});
                return;
            }

            const {account_type_id, balance, status} = req.body
            if (!account_type_id || !balance || !status){
                res.status(400).json({ message: 'account_type_id, balance or status are required' });
                return;
            }

            const existingAccountType = await pool.query(
               `SELECT id from account_types WHERE id = $1`,
               [account_type_id]);
            if(existingAccountType.rows.length === 0){
                res.status(400).json({ message: "This type not exists in table" });
                return;
            }

            if(status !== 'active' && status !== 'blocked' && status !== 'closed'){
                res.status(400).json({ message: 'This satatus dont exists'});
                return;
            }

            const result = await pool.query(
                `UPDATE accounts SET account_type_id = $1, balance = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
                [account_type_id, balance, status, accountId]
            );

            res.json({
                message: 'Account updated successfully',
                account: result.rows[0]
            });
        }catch(error){
            res.status(500).json({
                message: 'Error updating account',
                error: error instanceof Error ? error.message : String(error)
            })
        }

    };


    static updateAccountUser = async(req: any, res:Response): Promise<void> =>{
        try{
            const accountId = req.account.id;
            const check = await pool.query(
                `SELECT 
                    a.*,
                    u.*,
                    at.*
                    FROM accounts a 
                    INNER JOIN users u ON a.user_id = u.id 
                    INNER JOIN account_types at ON a.account_type_id = at.id 
                WHERE a.id = $1`,
                [accountId]
            );

            if(check.rows.length === 0){
                res.status(404).json({message: 'Account not found'});
                return;
            }

            const {balance, status} = req.body
            if (!balance || !status){
                res.status(400).json({ message: 'balance or status are required' });
                return;
            }

            if(status !== 'active' && status !== 'blocked' && status !== 'closed'){
                res.status(400).json({ message: 'This satatus dont exists'});
                return;
            }

            const result = await pool.query(
                `UPDATE accounts SET balance = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
                [balance, status, accountId]
            );
            res.json({
                message: 'Account updated successfully',
                account: result.rows[0]
            });
        }catch(error){
            res.status(500).json({
                message: 'Error updating account',
                error: error instanceof Error ? error.message : String(error)
            })
        }
    };


    static deleteAccountAdmin = async(req:Request, res:Response):Promise<void> =>{
        try{
            const {accountId} = req.params;
            const check = await pool.query(
                `SELECT 
                    a.*,
                    u.*,
                    at.*
                    FROM accounts a 
                    INNER JOIN users u ON a.user_id = u.id 
                    INNER JOIN account_types at ON a.account_type_id = at.id 
                WHERE a.id = $1`,
                [accountId]
            );

            if(check.rows.length === 0){
                res.status(404).json({message: 'Account not found'});
                return;
            }

            const result = await pool.query(
                `DELETE FROM accounts WHERE id = $1 RETURNING *`,
                [accountId]
            );
            res.json({
                message: 'Account deleted successfully',
            });
        }catch(error){
            res.status(500).json({
                message: 'Error deleting account',
                error: error instanceof Error ? error.message : String(error)
            });
        }
    };


    static deleteAccountUser = async(req:any, res:Response):Promise<void> =>{
        try{
            const accountId = req.account.id;
            const check = await pool.query(
                `SELECT 
                    a.*,
                    u.*,
                    at.*
                    FROM accounts a 
                    INNER JOIN users u ON a.user_id = u.id 
                    INNER JOIN account_types at ON a.account_type_id = at.id 
                WHERE a.id = $1`,
                [accountId]
            );

            if(check.rows.length === 0){
                res.status(404).json({message: 'Account not found'});
                return;
            }

            const result = await pool.query(
                `DELETE FROM accounts WHERE id = $1 RETURNING *`,
                [accountId]
            );
            res.json({
                message: 'Account deleted successfully',
            });
        }catch(error){
            res.status(500).json({
                message: 'Error deleting account',
                error: error instanceof Error ? error.message : String(error)
            });
        }
    };

    
}
