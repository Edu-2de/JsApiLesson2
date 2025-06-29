import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

// Função de registro
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      data: { name, email, password: hashedPassword }
    });
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Função de login
export const login = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const user = await User.findUnique({
      where: email ? { email } : { name }
    });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role, cash : user.cash }, JWT_SECRET, { expiresIn: "2h" });

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, cash: user.cash } });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      cash: user.cash,
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


