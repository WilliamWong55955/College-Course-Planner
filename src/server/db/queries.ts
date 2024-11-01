import "server-only";
import { db } from "~/server/db";
import { courses } from "~/server/db/schema"; // Ensure this points to the correct schema
import { type Course } from "~/server/db/types"; // Ensure Course type reflects the new schema

export async function getCourses(): Promise<Course[]> {
  const courseData = await db
    .select({
      id: courses.id,
      course_code: courses.course_code,
      title: courses.title,
      degree: courses.degree,
      units: courses.units
    })
    .from(courses);

  return courseData;
}
