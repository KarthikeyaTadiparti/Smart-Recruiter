import wrapAsync from "../utils/wrap-async.ts";
import { addCompany } from "../services/companies-services.ts";
import { Request, Response } from "express";

export const createCompany = wrapAsync(async (req: Request, res: Response) => {
    const userId = parseInt(req.user!.id);
    const { name, description, website } = req.body;
    const company = await addCompany(name, description, website, userId);

    return res.status(200).json({
        status: true,
        company: company,
        message: "Company created successfully!"
    });
});