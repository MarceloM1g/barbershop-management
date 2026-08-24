import { prisma } from "@/lib/prisma";
import { times } from "@/constants/schedule";
import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth-token";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const user = verifyAuthToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    if (user.role !== "CLIENT") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;

    const barberId = searchParams.get("barberId");
    const date = searchParams.get("date");

    if (!barberId || !date) {
      return NextResponse.json(
        { error: "Os parâmetros 'barberId' e 'date' são obrigatórios." },
        { status: 400 },
      );
    }

    const inicioDoDia = new Date(`${date}T00:00:00`);
    const fimDoDia = new Date(`${date}T23:59:59`);

    const busySlots = await prisma.appointment.findMany({
      where: {
        barberId: barberId,
        scheduledAt: {
          gte: inicioDoDia,
          lt: fimDoDia,
        },
      },
    });

    const occupiedTimes = busySlots.map((appointment) => {
      return appointment.scheduledAt.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    });

    const now = new Date();

    const availableTimes = times.filter((time) => {
      const slotDate = new Date(`${date}T${time}:00`);

      if (slotDate < now) {
        return false;
      }

      return !occupiedTimes.includes(time);
    });

    return NextResponse.json(availableTimes);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Erro ao buscar Horários" },
      { status: 500 },
    );
  }
}
