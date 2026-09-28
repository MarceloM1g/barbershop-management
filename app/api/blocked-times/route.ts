import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/auth-token";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const user = verifyAuthToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    if (user.role !== "BARBER") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { date, selectedTimes } = await req.json();
    const barberId = user.userId;

    if (!date || !Array.isArray(selectedTimes) || selectedTimes.length === 0) {
      return NextResponse.json(
        { error: "Data e horários são obrigatórios." },
        { status: 400 },
      );
    }

    const now = new Date();

    const selectedDate = new Date(`${date}T00:00:00`);

    if (
      selectedDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())
    ) {
      return NextResponse.json(
        { error: "O dia selecionado já passou" },
        { status: 409 },
      );
    }

    for (const time of selectedTimes) {
      const slotDate = new Date(`${date}T${time}:00`);

      if (slotDate < now) {
        return NextResponse.json(
          { error: "Horário já passou" },
          { status: 409 },
        );
      }
    }

    const existingBlocks = await prisma.blockedTime.findMany({
      where: {
        barberId,
        date,
        time: {
          in: selectedTimes,
        },
      },
    });

    if (existingBlocks.length > 0) {
      return NextResponse.json(
        { error: "Um ou mais horários já estão bloqueados" },
        { status: 409 },
      );
    }

    const blockedTimes = await prisma.blockedTime.createMany({
      data: selectedTimes.map((time) => ({
        barberId,
        date,
        time,
      })),
    });

    return NextResponse.json(blockedTimes, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao bloquear horário" },
      { status: 500 },
    );
  }
}
