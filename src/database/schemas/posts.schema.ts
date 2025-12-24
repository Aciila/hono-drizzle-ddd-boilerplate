import { boolean, index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { commonColumns } from "./common";
import { users } from "./users.schema";

// =============================================================================
// Posts Table (One-to-Many Relationship Example)
// =============================================================================

export const posts = pgTable(
  "posts",
  {
    ...commonColumns,
    title: text().notNull(),
    content: text().notNull(),
    published: boolean().notNull().default(false),
    authorId: uuid()
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    index("posts_author_id_idx").on(table.authorId),
    index("posts_published_idx").on(table.published),
  ]
);

export type PostsInsert = typeof posts.$inferInsert;
export type PostsSelect = typeof posts.$inferSelect;
