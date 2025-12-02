// import wrapAsync from "../utils/wrap-async.ts";
// import { Request, Response } from "express";

// export const createJob = wrapAsync(async (req: Request, res: Response) => {
//     const userId = parseInt(req.user!.id);
//     const { title, description, location, company } = req.body;
//     const job = await addJob(title, description, location, company, userId);

//     return res.status(200).json({
//         status: true,
//         job: job,
//         message: "Job created successfully!"
//     });
// })