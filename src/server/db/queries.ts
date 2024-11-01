import "server-only";
import { db } from "~/server/db";
import { courses } from "~/server/db/schema";
import { type Course } from "~/server/db/types";
import { eq } from "drizzle-orm";

export async function getCourses(majorId?: string, limit = 100, offset = 0): Promise<Course[]> {
  try {
    let query = db
      .select({
        id: courses.id,
        course_name: courses.course_name,
        course_code: courses.course_code,
        units: courses.units,
        department: courses.department,
      })
      .from(courses)
      .limit(limit)
      .offset(offset);

    if (majorId) {
      query = query.where(eq(courses.major_id, majorId));
    }

    const courseData = await query;
    return courseData;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  }
}

export async function getCoursesByDepartment(department: string): Promise<Course[]> {
  try {
    const courseData = await db
      .select({
        id: courses.id,
        course_name: courses.course_name,
        course_code: courses.course_code,
        units: courses.units,
        department: courses.department,
      })
      .from(courses)
      .where(eq(courses.department, department));

    return courseData;
  } catch (error) {
    console.error("Error fetching courses by department:", error);
    throw new Error("Failed to fetch courses by department");
  }
}