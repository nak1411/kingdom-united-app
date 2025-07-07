import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const dataTable = pgTable("data", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  zip: integer("zip").notNull(),
  prayerText: text("prayer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
