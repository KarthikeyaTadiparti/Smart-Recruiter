import { pgTable, serial, varchar, timestamp, integer, text } from "drizzle-orm/pg-core";
import { users } from "./users-schema.ts";

export const companies = pgTable("companies", {
    companyId: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description").notNull(),
    website: varchar("website", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});