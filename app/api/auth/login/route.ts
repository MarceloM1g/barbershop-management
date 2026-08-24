import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }

    const emailNormalized = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: emailNormalized,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário ou senha incorretos" },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Usuário ou senha incorretos" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    const response = NextResponse.json(
      {
        message: "Login realizado com sucesso",
        user: safeUser,
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
