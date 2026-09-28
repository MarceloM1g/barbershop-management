import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/auth-token";
import { times } from "@/constants/schedule";

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

    if (user.role !== "BARBER") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const date = searchParams.get("date");

    if (!user.userId || !date) {
      return NextResponse.json(
        { error: "Usuário e data são obrigatórios." },
        { status: 400 },
      );
    }

    const barberId = user.userId;

    const blockedTimes = await prisma.blockedTime.findMany({
      where: {
        barberId: user.userId,
        date,
      },
    });

    const inicioDoDia = new Date(`${date}T00:00:00`);
    const fimDoDia = new Date(`${date}T23:59:59`);

    const busySlots = await prisma.appointment.findMany({
      where: {
        barberId,
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

    const isDayBlocked = blockedTimes.some((blocked) => {
      return blocked.time === null;
    });

    const now = new Date();

    const displayTimes = times.map((time) => {
      const slotDate = new Date(`${date}T${time}:00`);

      if (slotDate < now) {
        return {
          time,
          status: "PAST",
        };
      }

      if (occupiedTimes.includes(time)) {
        return {
          time,
          status: "OCCUPIED",
        };
      }

      if (isDayBlocked) {
        return {
          time,
          status: "BLOCKED",
        };
      }

      if (blockedTimes.some((blocked) => blocked.time === time)) {
        return {
          time,
          status: "BLOCKED",
        };
      }

      return {
        time,
        status: "AVAILABLE",
      };
    });

    console.log("NOW", now);

    console.log("DATE PARAM", date);

    console.log(
      "BUSY SLOTS",
      busySlots.map((appointment) => ({
        raw: appointment.scheduledAt,
      })),
    );

    console.log("OCCUPIED", occupiedTimes);

    return NextResponse.json(displayTimes);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Erro ao buscar Horários" },
      { status: 500 },
    );
  }
}
