import redisClient from "../config/redis.ts";

export const invalidateKeys = async (keys: string[]) => {
    if (keys.length) {
        await redisClient.del(keys);
    }
};
