import { timestamp, uuid } from "drizzle-orm/pg-core";

// =============================================================================
// Common Column Definitions
// =============================================================================
//
// Reusable column helpers for consistency across all tables.
// Import these in your table schema files.

export const id = () => uuid().primaryKey().defaultRandom();

export const commonColumns = {
  id: id(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  deletedAt: timestamp(), // Soft delete support
};
