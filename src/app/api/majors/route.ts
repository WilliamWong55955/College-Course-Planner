import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { majors } from '~/server/db/schema';

export async function GET() {
  try {
    const majorData = await db
      .select({
        id: majors.id,
        name: majors.name,
      })
      .from(majors);

    return NextResponse.json(majorData);
  } catch (error) {
    console.error("Failed to fetch majors:", error);
    return NextResponse.json({ error: "Failed to fetch majors" }, { status: 500 });
  }
}
