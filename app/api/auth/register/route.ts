import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }

    const emailNormalized = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: emailNormalized,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "E-mail já cadastrado" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email: emailNormalized,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Usuário criado" }, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 },
    );
  }
}
