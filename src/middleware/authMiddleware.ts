import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request{
    user?: {
        account: { id: number; balance: number; account_number: string; status: string };
        user: { name: string; email: string; age: number; role: string };
        account_type: { type: string; limits: any };
    }
}

const JWT_SECRET = process.env.JWT_SECRET || '';

export class AuthMiddleware{
    static authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void =>{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            res.status(401).json({
                message: 'Access denied. No token provided.'
            });
            return;
        }

        try{
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            req.user = decoded;
            next();
        }catch(error){
            res.status(403).json({
                message: 'Invalid token.'
            });
        }
    };

    static requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void =>{
        if(!req.user){
            res.status(401).json({
                message: 'Access denied. No user information.'
            });
            return;
        }

        if(req.user.user.role !== 'full_access'){
            res.status(403).json({
                message: 'Access denied. Full access required.'
            });
            return;
        }

        next();
    };

    static requireAdminOrOwner = (req: AuthRequest, res: Response, next: NextFunction): void =>{
        const userFromToken = req.user;
        const { id } = req.params;

        if (userFromToken?.user.role === 'full_access' || userFromToken?.user.role === 'limit_access'){            
            next();
            return;
        }

        if (userFromToken && userFromToken.user.id === parseInt(id)){
            next();
            return;
        }

        res.status(403).json({message: 'Access denied.'})
        return;
    }
}