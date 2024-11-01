// src/app/api/courses/route.ts

import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { courses } from '~/server/db/schema';

export async function GET() {
  try {
    const courseData = await db
      .select({
        id: courses.id,
        course_code: courses.course_code,
        title: courses.title,
        units: courses.units,
        degree: courses.degree,
      })
      .from(courses);

    return NextResponse.json(courseData);
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
