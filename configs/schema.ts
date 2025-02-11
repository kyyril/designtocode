import {
  integer,
  pgTable,
  varchar,
  json,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(0),
});

export const DesignToCodeTable = pgTable("designToCode", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uid: varchar().notNull(),
  imageUrl: varchar().notNull(),
  model: varchar(),
  prompt: varchar(),
  code: json(),
  createdBy: varchar(),
  createdAt: timestamp().defaultNow().notNull(),
});
