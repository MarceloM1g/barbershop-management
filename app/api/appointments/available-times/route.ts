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

    /* Buscar Horários que já estão marcados */
    const busySlots = await prisma.appointment.findMany({
      where: {
        barberId: barberId,
        scheduledAt: {
          gte: inicioDoDia,
          lt: fimDoDia,
        },
      },
    });

    /* Formatação */
    const occupiedTimes = busySlots.map((appointment) => {
      return appointment.scheduledAt.toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    });

    const blockedSlots = await prisma.blockedTime.findMany({
      where: {
        barberId,
        date,
      },
    });

    const blockedTimes = blockedSlots.map((blocked) => {
      return blocked.time;
    });

    const isDayBlocked = blockedSlots.some((blocked) => {
      return blocked.time === null;
    });

    const now = new Date();

    /* Filtrando os horários */
    const availableTimes = times.filter((time) => {
      console.log("NOW", now.toISOString());

      const slotDate = new Date(`${date}T${time}:00`);

      console.log("TIME:", time, "SLOT:", slotDate.toISOString());

      if (slotDate < now) {
        return false;
      }

      if (isDayBlocked) {
        return false;
      }

      /* Removendo horários ocupados e bloqueados */
      return !occupiedTimes.includes(time) && !blockedTimes.includes(time);
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
