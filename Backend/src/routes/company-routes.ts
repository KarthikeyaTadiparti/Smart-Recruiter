import {Router} from "express";
import { createCompany } from "../controllers/company-controller.ts";
import { ensureAuthentication } from "../middlewares/auth.ts";

const companyRouter = Router();

companyRouter.post("/", ensureAuthentication,createCompany);

export default companyRouter;