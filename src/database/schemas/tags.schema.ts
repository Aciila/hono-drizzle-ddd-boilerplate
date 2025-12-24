import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { commonColumns, id } from "./common";
import { posts } from "./posts.schema";

// =============================================================================
// Tags Table (Many-to-Many Relationship Example - Part 1)
// =============================================================================

export const tags = pgTable("tags", {
  ...commonColumns,
  name: text().notNull().unique(),
});

export type TagsInsert = typeof tags.$inferInsert;
export type TagsSelect = typeof tags.$inferSelect;

// =============================================================================
// Posts-Tags Junction Table (Many-to-Many Relationship - Part 2)
// =============================================================================

export const postsTags = pgTable(
  "posts_tags",
  {
    id: id(),
    postId: uuid()
      .notNull()
      .references(() => posts.id),
    tagId: uuid()
      .notNull()
      .references(() => tags.id),
  },
  (table) => [
    index("posts_tags_post_id_idx").on(table.postId),
    index("posts_tags_tag_id_idx").on(table.tagId),
  ]
);

export type PostsTagsInsert = typeof postsTags.$inferInsert;
export type PostsTagsSelect = typeof postsTags.$inferSelect;
