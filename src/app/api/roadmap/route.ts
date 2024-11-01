import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { roadmap } from '~/server/db/schema';

export async function GET() {
  try {
    const courseData = await db
      .select({
        id: roadmap.id,
        course_code: roadmap.course_code,
        title: roadmap.major,
        units: roadmap.units,
        degree: roadmap.semester,
      })
      .from(roadmap);

    return NextResponse.json(courseData);
  } catch (error) {
    console.error("Failed to fetch roadmap:", error);
    return NextResponse.json({ error: "Failed to fetch roadmap" }, { status: 500 });
  }
}
