import "server-only";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { desc } from "drizzle-orm/expressions";
import { courses} from "~/server/db/schema" // add roadmap later
import { type Course } from "~/server/db/types"
// import { eq } from "drizzle-orm/expressions";
// Define the return type based on your schema
export async function getImages() {
    const imagesData = await db
      .select()
      .from(images)
      .orderBy(desc(images.id));
  
    return imagesData; // Make sure to return the fetched data
  }
// export async function getCoursesForMajor(majorId: string) {
//   const coursesData = await db.select().from(courses)  // Ensure "courses" is defined in schema.ts
//   .where(eq(courses.majorId, majorId))
//   .orderBy(courses.sequence); // Assuming sequence in the roadmap
//   return coursesData;
// }
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

