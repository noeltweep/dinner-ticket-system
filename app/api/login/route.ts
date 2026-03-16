import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });

  // 🔐 Set secure HTTP-only cookie
  response.cookies.set("admin_auth", "true", {
    httpOnly: true,
    secure: false, // set to true in production (https)
    sameSite: "lax",
    path: "/",
  });

  return response;
}