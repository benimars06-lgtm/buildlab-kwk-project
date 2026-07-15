import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// ============================================================
// DATABASE SCHEMA — Community Hub
// ============================================================
// This file defines all the tables in the database.
// Participants will modify this file when tickets require schema changes
// (e.g., adding the EventRSVP table in Ticket #9).
// ============================================================

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  image: text("image"),
});

export const communities = pgTable("communities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
});

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location").notNull(),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id),
});

export const resources = pgTable("resources", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description").notNull(),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id),
});

export const comments = pgTable("comments", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
