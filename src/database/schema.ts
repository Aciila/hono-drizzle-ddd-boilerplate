import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const id = () => uuid().primaryKey().defaultRandom();

const commonColumns = {
  id: id(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
};

export const exampleTable = pgTable(
  "example_table",
  {
    ...commonColumns,
    name: text().notNull(),
    description: text(),
  },
  (table) => [index("example_name_idx").on(table.name)]
);

// =============================================================================
// Users Table (Example)
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
