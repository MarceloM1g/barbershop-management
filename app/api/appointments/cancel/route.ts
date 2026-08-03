import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/auth-token";
import { Status } from "@prisma/client";

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value
        const user = verifyAuthToken(token);

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não autenticado' },
                { status: 401 }
            )
        }

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { error: "Id não informado" },
                { status: 400 }
            )
        }

        const appointment = await prisma.appointment.findUnique({
            where: {
                id
            }
        });

        if (!appointment) {
            return NextResponse.json(
                { error: 'Agendamento não encontrado' },
                { status: 404 }
            )
        }

        if (appointment.userId !== user.userId && appointment.barberId !== user.userId) {
            return NextResponse.json(
                { error: 'Acesso negado' },
                { status: 403 }
            )
        }

        await prisma.appointment.update({
            where: {
                id
            },
            data: {
                status: Status.CANCELLED
            }
        });

        return NextResponse.json(
            { message: "Cancelamento realizado com sucesso" },
            { status: 200 }
        );

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: 'Erro ao cancelar agendamento' },
            { status: 500 }
        )
    }
}