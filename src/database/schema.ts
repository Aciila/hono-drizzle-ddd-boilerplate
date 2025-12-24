// =============================================================================
// Database Schema
// =============================================================================
//
// This file re-exports all table schemas from separate files.
// Each table schema is defined in its own file under ./schemas/
//
// To add a new table:
// 1. Create a new file: ./schemas/[tablename].schema.ts
// 2. Import and re-export it here
//
// =============================================================================

// Common column definitions
export { commonColumns, id } from "./schemas/common";

// Table schemas
export {
  users,
  type UsersInsert,
  type UsersSelect,
} from "./schemas/users.schema";
export {
  posts,
  type PostsInsert,
  type PostsSelect,
} from "./schemas/posts.schema";
export {
  tags,
  postsTags,
  type TagsInsert,
  type TagsSelect,
  type PostsTagsInsert,
  type PostsTagsSelect,
} from "./schemas/tags.schema";
