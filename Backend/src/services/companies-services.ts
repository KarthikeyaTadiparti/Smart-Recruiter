import db from "../config/db.ts";
import { eq } from "drizzle-orm";
import { companies } from "../schema/companies-schema.ts";
import { users } from "../schema/users-schema.ts";
import ExpressError from "../middlewares/errorhandler.ts";


export async function addCompany(
  name: string,
  description: string,
  website: string,
  userId: number
) {
  // Create company
  const [company] = await db
    .insert(companies)
    .values({ name, description, website })
    .returning({
      companyId: companies.companyId,
      name: companies.name,
      description: companies.description,
      website: companies.website,
    });

  if (!company?.companyId) {
    throw new ExpressError(500, "Failed to create company");
  }

  // Assign company to user
  const updated = await db
    .update(users)
    .set({ companyId: company.companyId })
    .where(eq(users.id, userId))
    .returning({ id: users.id });


  return company;
}
