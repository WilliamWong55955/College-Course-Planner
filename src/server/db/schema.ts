// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `t3willdevtop_${name}`);

export const images = createTable(
  "image",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    url: varchar("url", { length: 1024 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);

export const courses = createTable(
  "courses", {
  id: serial("id").primaryKey(),
  course_code: varchar("course_code", { length: 20 }).notNull(),
  course_name: varchar("course_name", { length: 255 }).notNull(),
  units: integer("units").notNull(),
  department: varchar("department", { length: 255 }),
});


export const majors = createTable(
  "majors", 
  {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }),
});

export const requirements = createTable("requirements", {
  id: serial("id").primaryKey(),
  major_id: integer("major_id").references(() => majors.id),
  course_id: integer("course_id").references(() => courses.id),
  requirement_type: varchar("requirement_type", { length: 50 }),
});

export const roadmap = createTable("roadmap", {
  id: serial("id").primaryKey(),
  major_id: integer("major_id").references(() => majors.id),
  course_id: integer("course_id").references(() => courses.id),
  semester: varchar("semester", { length: 20 }),
  sequence: integer("sequence"),
});

