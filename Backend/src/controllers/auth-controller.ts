import { Request, Response } from "express";
import bcrypt from "bcrypt";
import ExpressError from "../middlewares/errorhandler.ts";
import genJwt from "../utils/gen-jwt.ts";
import wrapAsync from "../utils/wrap-async.ts";
import { createUser, getAllUsers, getRecruiterCompany, getUserByEmailAndRole } from "../services/users-services.ts";

// Signup
export const handleUserSignup = wrapAsync(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    const existingUser = await getUserByEmailAndRole(email, role);
    if (existingUser) {
        throw new ExpressError(409, "User already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(name, email, hashedPassword, role);

    if (!newUser?.id) {
        throw new ExpressError(500, "Failed to create user");
    }

    genJwt(res, newUser.id);

    return res.status(201).json({
        status: true,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
        company: null,
        message: "User registered successfully!",
    });
});

// Login
export const handleUserLogin = wrapAsync(async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    const user = await getUserByEmailAndRole(email, role);
    if (!user)
        throw new ExpressError(403, "User does not exist!");

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword)
        throw new ExpressError(403, "Invalid email or password!");

    let responseUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    let responseCompany = user.companyId ? { id: user.companyId } : null;

    if (user.role === "recruiter") {
        const recruiterData = await getRecruiterCompany(user.id);
        if (recruiterData) {
            responseUser = {
                id: recruiterData.id,
                name: recruiterData.name,
                email: recruiterData.email,
                role: recruiterData.role,
            };
            responseCompany = recruiterData.company;
        }
    }

    genJwt(res, user.id);

    return res.status(200).json({
        status: true,
        user: responseUser,
        company: responseCompany,
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
    const users = await getAllUsers()
    return res.status(200).json({
        status: true,
        data: users
    });
});
