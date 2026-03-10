import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json({ success: false, message: "Code is required" }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbwu93DNeKqcO_JYt-qGPi-E6UW7hNoRT7LRdg6_UuAyxNEkQYuYFmXVo55yy68q-GfF9A/exec";
    
    const response = await fetch(`${scriptUrl}?code=${encodeURIComponent(code)}`);
    const data = await response.json();
    
    if (data.success) {
      return NextResponse.json({ success: true, message: data.message || "Code verified successfully" });
    } else {
      return NextResponse.json({ success: false, message: data.message || "Invalid or already used code" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json({ success: false, message: "Server error while verifying code" }, { status: 500 });
  }
}
