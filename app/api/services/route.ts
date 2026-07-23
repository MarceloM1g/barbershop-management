import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/auth-token";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        const user = verifyAuthToken(token);

        if (!user) {
            return NextResponse.json(
                { error: "Usuário não autenticado" },
                { status: 401 }
            )
        }

        const services = await prisma.service.findMany({
            where: {
                active: true,
            },
            orderBy: {
                displayOrder: "asc",
            },
        });

        return NextResponse.json(
            { services },
            { status: 200 },
        )


    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: 'Erro ao fazer o agendamento' },
            { status: 500 }
        )
    }
}