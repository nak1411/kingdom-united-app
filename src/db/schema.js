import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const dataTable = pgTable("data", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  zip: varchar("zip").notNull(),
  prayerText: text("prayer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
