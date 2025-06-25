import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

export const authMiddleware = (req, res, next) => {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token){
            return res.status(401).json({message: "Access denied, no token provided"});
      }

      jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err){
                  return res.status(403).json({message: "Invalid token"});
            }
            req.user = user;
            next();
      });
}