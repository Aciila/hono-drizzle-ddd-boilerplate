import { boolean, index, pgTable, text } from "drizzle-orm/pg-core";
import { commonColumns } from "./common";

// =============================================================================
// Users Table
// =============================================================================

export const users = pgTable(
  "users",
  {
    ...commonColumns,
    email: text().notNull().unique(),
    name: text().notNull(),
    isActive: boolean().notNull().default(true),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_is_active_idx").on(table.isActive),
  ]
);

export type UsersInsert = typeof users.$inferInsert;
export type UsersSelect = typeof users.$inferSelect;
