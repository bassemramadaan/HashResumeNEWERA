import { NextResponse } from 'next/server';
import { getCV } from '../../../../lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = getCV(id);
    if (!data) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error retrieving CV:", error);
    return NextResponse.json({ error: "Failed to retrieve CV" }, { status: 500 });
  }
}
