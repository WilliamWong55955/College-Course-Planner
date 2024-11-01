import { NextResponse } from 'next/server';
import { db } from '~/server/db'; // adjust path as needed
import { courses } from '~/server/db/schema'; // adjust path as needed
import { eq } from 'drizzle-orm'; // adjust this import based on Drizzle's documentation

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const degree = searchParams.get('degree');

  try {
    const courseQuery = db
      .select({
        id: courses.id,
        course_code: courses.course_code,
        title: courses.title,
        units: courses.units,
        degree: courses.degree,
      })
      .from(courses)
      .where(degree ? eq(courses.degree, degree) : undefined); // Apply filtering if 'degree' parameter is provided

    const courseData = await courseQuery;
    return NextResponse.json(courseData);
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
