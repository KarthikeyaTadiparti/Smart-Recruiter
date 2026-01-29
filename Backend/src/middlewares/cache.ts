import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis.ts";

export const cache = (keyBuilder: (req: Request) => string, ttl = 300) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const key = keyBuilder(req);

        try {
            const cachedData = await redisClient.get(key);
            if (cachedData) {
                console.log("Cache hit");
                return res.json(JSON.parse(cachedData));
            }
        } catch (err: any) {
            console.error("Redis GET failed:", err);
            // silently fall through
        }

        // store the res.json method in a variable
        let originalJson = res.json.bind(res);

        // override the res.json method
        res.json = (body: any) => {
            // if the response is successful
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    console.log("Cache miss");
                    redisClient
                        .setEx(key, ttl, JSON.stringify(body))
                        .catch((err: any) => {
                            console.error("Redis SET failed:", err);
                        });
                } catch (err: any) {
                    console.error("Redis SET failed:", err);
                }
            }
            
            // call the original res.json method
            return originalJson(body);
        };

        next();
    }
}