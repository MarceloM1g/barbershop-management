import { NextResponse } from "next/server";

export function POST() {
    try {
        const response = NextResponse.json(
            {
                message: "Logout realizado com sucesso"
            },
            { status: 200 }
        );

        response.cookies.delete("token");

        return response;
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}