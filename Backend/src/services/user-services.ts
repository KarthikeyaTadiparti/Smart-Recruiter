import db from "../config/db.ts";
import { eq, and } from "drizzle-orm";
import { userRoleEnum, users, User } from "../schema/users-schema.ts";

export type UserRole = (typeof userRoleEnum.enumValues)[number];

export async function createUser(name:string,email:string,password: string,role: UserRole){
    const [user] = await db.insert(users).values({name,email,password,role}).returning();
    return user;
}
export async function getUserByEmailAndRole(email: string, role: UserRole){
    const [user] = await db.select().from(users).where(and(eq(users.email, email), eq(users.role, role))).limit(1);
    return user;
}

export async function getAllUsers() {
    const data = await db.select().from(users);
    return data;
}