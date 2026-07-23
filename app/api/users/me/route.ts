import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/auth-token";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        const userInfo = verifyAuthToken(token);

        if (!userInfo) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: {
                email: userInfo.email
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            { status: 200 },
        )

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: 'Erro ao buscar usuário' },
            { status: 500 }
        )
    }
}