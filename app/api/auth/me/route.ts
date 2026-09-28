import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth-token";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const user = verifyAuthToken(token);

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    userId: user.userId,
    role: user.role,
  });
}