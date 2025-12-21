import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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
