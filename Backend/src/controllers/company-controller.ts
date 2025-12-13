import wrapAsync from "../utils/wrap-async.ts";
import { addCompany } from "../services/companies-services.ts";
import { Request, Response } from "express";

export const createCompany = wrapAsync(async (req: Request, res: Response) => {
    const userId = Number(req.user!.id);
    const { name, description, website } = req.body;
    const company = await addCompany(name, description, website, userId);

    const responseCompany = {
        id : company.companyId,
        name : company.name,
        description : company.description,
        website : company.website
    }

    return res.status(200).json({
        status: true,
        company: responseCompany,
        message: "Company created successfully!"
    });
});