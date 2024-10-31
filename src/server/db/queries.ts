import "server-only";
import { db } from "~/server/db";
import { desc } from "drizzle-orm/expressions";
import { courses} from "~/server/db/schema" // add roadmap later
import { type Course } from "~/server/db/types" 

export async function getCourses(): Promise<Course[]>{
  const courseData = await db
      .select({id: courses.id,
        course_name: courses.course_name,
        course_code: courses.course_code,
        units: courses.units,
        department: courses.department,
      })
      .from(courses);
  return courseData;
}

