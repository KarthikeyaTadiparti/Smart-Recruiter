import { Request, Response } from "express";
import bcrypt from "bcrypt";
import ExpressError from "../middlewares/errorhandler.ts";
import genJwt from "../utils/gen-jwt.ts";
import wrapAsync from "../utils/wrap-async.ts";
import { createUser, getAllUsers, getUserByEmailAndRole } from "../services/users-services.ts";
import { getCompany } from "../services/companies-services.ts";

// Signup
export const handleUserSignup = wrapAsync(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    const user = await getUserByEmailAndRole(email, role);
    if (user)
        throw new ExpressError(409, "User already exists!");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser (name,email,hashedPassword,role);

    if (!newUser || !newUser.id) 
        throw new ExpressError(500, "Failed to create user");

    let company;
    if(newUser.role === "recruiter"){
        company = await getCompany(newUser.id);
    }
    const id = newUser.id;
    const companyId = company?.companyId;
    genJwt(res, id, companyId);

    return res.status(200).json({
        status: true,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        },
        company : company ? company : null,
        message: "User registered successfully!"
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

    let company;
    if(user.role === "recruiter"){
        company = await getCompany(user.id);
    }
    const id = user.id;
    const companyId = company?.companyId;
    genJwt(res, id, companyId);

    return res.status(200).json({
        status: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        company : company ?? null,
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
