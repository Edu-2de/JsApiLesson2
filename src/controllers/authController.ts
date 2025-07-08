import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../database/connection'

const JWT_SECRET = process.env.JWT_SECRET || '';

export class AuthController{
    static login = async(req: Request, res:Response): Promise<void> =>{
        try{
            const{email, password} = req.body;
            if(!email || !password){
                res.status(400).json({message: 'Email and password are required'})
                return;
            }


            const result = await pool.query(
                'SELECT id, name, email, age, password_hash, role, created_at, update_at FROM users WHERE email = $1',
                [email]
            )
            if (result.rows.length == 0){
                res.status(401).json({message: 'Invalid email or password!'})
            }
            const user = result.rows[0]


            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid){
                res.status(401).json({message: 'Invalid email or password'})
                return;
            }


            const token = jwt.sign(
                {
                    id:user.id,
                    email: user.email,
                    age: user.age,
                    role: user.role
                },
                JWT_SECRET,
                {expiresIn: '24h'}
            );
            res.json({
                message: 'Login successful',
                token,
                user: {
                    id:user.id,
                    email: user.email,
                    age: user.age,
                    role: user.role
                }
            });
        } catch(error){
            res.status(500).json({
                message: 'Error during login',
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }


  
}