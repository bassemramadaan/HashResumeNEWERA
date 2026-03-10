import { NextResponse } from 'next/server';
import { saveCV } from '../../../lib/db';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const { data } = await request.json();
    if (!data) {
      return NextResponse.json({ error: "Data is required" }, { status: 400 });
    }
    const id = nanoid(10);
    saveCV(id, data);
    return NextResponse.json({ id });
  } catch (error) {
    console.error("Error saving CV:", error);
    return NextResponse.json({ error: "Failed to save CV" }, { status: 500 });
  }
}
