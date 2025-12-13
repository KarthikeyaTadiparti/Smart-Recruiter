import db from "../config/db.ts";
import { eq, and } from "drizzle-orm";
import { userRoleEnum, users } from "../schema/users-schema.ts";
import { companies } from "../schema/companies-schema.ts";

export type UserRole = (typeof userRoleEnum.enumValues)[number];

export async function createUser(name: string, email: string, password: string, role: UserRole) {
    const [user] = await db
        .insert(users)
        .values({ name, email, password, role })
        .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            companyId: users.companyId,
        });
        return user;
}
export async function getUserByEmailAndRole(email: string, role: UserRole) {
    const [user] = await db.select().from(users).where(and(eq(users.email, email), eq(users.role, role))).limit(1);
    return user;
}

export async function getAllUsers() {
    const data = await db.select().from(users);
    return data;
}

export async function getRecruiterCompany(userId: number) {
  const [result] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      company: {
        id: companies.companyId,
        name: companies.name,
        website: companies.website,
        description: companies.description,
      },
    })
    .from(users)
    .innerJoin(companies, eq(users.companyId, companies.companyId))
    .where(eq(users.id, userId))
    .limit(1);

  return result;
}
