import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { schema } from "../schema/schema.ts";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema: schema });

export default db;
