import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/auth-token";

export async function GET(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;
        const user = verifyAuthToken(token);

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não autenticado' },
                { status: 401 }
            )
        }

        if (user.role !== "BARBER") {
            return NextResponse.json(
                { error: "Acesso negado" },
                { status: 403 }
            );
        }

        const appointments = await prisma.appointment.findMany({
            where: {
                barberId: user.userId
            }, include: {
                client: true,
                services: {
                    include: {
                        service: true
                    }
                }
            },
        });

        return NextResponse.json(
            { appointments },
        )

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: 'Erro ao listar agendamentos' },
            { status: 500 }
        )
    }
}