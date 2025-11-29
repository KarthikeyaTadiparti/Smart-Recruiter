import { Router } from "express";
import { handleUserSignup, handleUserLogin, handleUserLogout, handleGetAllUsers } from "../controllers/auth-controller.ts";
import { loginValidation, signupValidation } from "../middlewares/auth.ts";

const router = Router();

router.post("/signup", signupValidation, handleUserSignup);
router.post("/login", loginValidation, handleUserLogin);
router.get("/logout", handleUserLogout);

//users-data
router.get("/", handleGetAllUsers);



export default router;