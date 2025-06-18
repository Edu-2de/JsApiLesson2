import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

// Função de registro
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      data: { username, email, password: hashedPassword }
    });
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Função de login
export const login = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = await User.findUnique({
      where: email ? { email } : { username }
    });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};