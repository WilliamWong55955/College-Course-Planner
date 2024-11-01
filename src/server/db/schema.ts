// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import {
  pgTableCreator,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `t3willdevtop_${name}`);

export const courses = createTable(
  "courses", {
    id: serial("id").primaryKey(),
    course_code: varchar("course_code", { length: 20 }).notNull(),
    title: varchar("title", { length: 225 }).notNull(),
    units: varchar("units", { length: 225 }).notNull(),
    degree: varchar("degree", { length: 255 }).notNull(),
});


export const majors = createTable(
  "majors", 
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
  }
);

export const roadmap = createTable(
  "roadmap", 
  {
    id: serial("id").primaryKey(),
    major: varchar("major", { length: 255 }).notNull(),
    semester: varchar("semester", { length: 255 }).notNull(),
    course_code: varchar("course_code", { length: 255 }).notNull(),
    units: varchar("units", { length: 255 }).notNull(),
  }
);


