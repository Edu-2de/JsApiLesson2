const bycypt = require("bcrypt");   
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) =>{
      const {username, email, password} = req.body;
      try{
            const userExists = await prisma.user.findUnique({where: {email}});
            if(userExists){
                  return res.status(400).json({message: "User already exists"});
            }
            const hashedPassword = await bycrypt.hash(password, 10);
            const user = await User.create({
                  data: {username, email, password: hashedPassword}
            });
            res.status(201).json({
                  message: "User registered successfully",
                  user: {id: user.id, username: user.username, email: user.email}
            });
      } catch (error) {
            console.error("Error during registration:", error);
            res.status(500).json({message: "Internal server error"});
      }
}