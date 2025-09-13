import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel.ts";
import ExpressError from "../utils/ExpressError.ts";
import genJwt from "../utils/genJwt.ts";
import wrapAsync from "../utils/wrapAsync.ts";

// Signup
export const handleUserSignup = wrapAsync(async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;

    const user = await User.findOne({ email, role });
    if (user)
        return res.status(409).json({ status: false, message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role
    });
    await newUser.save();

    const id = newUser._id;
    genJwt(res, id);

    return res.status(200).json({
        status: true,
        user: {
            _id: newUser._id,
            name: newUser.username,
            email: newUser.email,
            role: newUser.role
        },
        message: "User registered successfully!"
    });
});

// Login
export const handleUserLogin = wrapAsync(async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role });
    if (!user)
        return res.status(403).json({ status: false, message: "User does not exist!" });

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword)
        return res.status(403).json({ status: false, message: "Invalid email or password!" });

    genJwt(res, user._id);

    return res.status(200).json({
        status: true,
        user: {
            _id: user._id,
            name: user.username,
            email: user.email,
            role: user.role
        },
        message: "User logged in successfully!"
    });
});

// Logout
export const handleUserLogout = wrapAsync(async (req: Request, res: Response) => {
    if (req.cookies.jwt) {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "none",
        });
        return res.status(200).json({ status: true, message: "User logged out successfully!" });
    }

    return res.status(200).json({ status: true, message: "No session found, but logged out anyway." });
});

// Get all users
export const handleGetAllUsers = wrapAsync(async (req: Request, res: Response) => {
    const users = await User.find();
    return res.status(200).json({
        status: true,
        data: users
    });
});
