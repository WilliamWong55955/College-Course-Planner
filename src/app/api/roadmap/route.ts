import { NextResponse } from 'next/server';
import { db } from '~/server/db'; // Adjust path as needed
import { roadmap } from '~/server/db/schema'; // Adjust path as needed
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const major = searchParams.get('major');

  if (!major) {
    return NextResponse.json({ error: "Major is required" }, { status: 400 });
  }

  try {
    const scheduleData = await db
      .select({
        id: roadmap.id,
        major: roadmap.major,
        semester: roadmap.semester,
        course_code: roadmap.course_code,
        units: roadmap.units,
      })
      .from(roadmap)
      .where(eq(roadmap.major, major));

    return NextResponse.json(scheduleData);
  } catch (error) {
    console.error("Failed to fetch recommended schedule:", error);
    return NextResponse.json({ error: "Failed to fetch recommended schedule" }, { status: 500 });
  }
}
