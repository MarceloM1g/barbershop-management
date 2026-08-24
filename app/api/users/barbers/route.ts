import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/auth-token";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const user = verifyAuthToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 401 },
      );
    }

    if (user.role !== "CLIENT") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const barbers = await prisma.user.findMany({
      where: {
        role: "BARBER",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(barbers);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar usuário" },
      { status: 500 },
    );
  }
}
