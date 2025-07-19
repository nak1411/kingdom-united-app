import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const dataTable = pgTable("data", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  zip: integer("zip").notNull(), // Changed from varchar to integer to match migration
  prayerText: text("prayer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
