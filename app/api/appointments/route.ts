import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { verifyAuthToken } from "@/lib/auth-token";

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        const user = verifyAuthToken(token);

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não autenticado' },
                { status: 401 }
            )
        }

        const userId = user.userId;

        const { barberId, serviceIds, scheduledAt } = await req.json();

        if (!barberId?.trim() || !Array.isArray(serviceIds) || serviceIds.length === 0 || !scheduledAt?.trim()) {
            return NextResponse.json(
                { error: "Todos os campos são obrigatórios" },
                { status: 400 }
            );
        }

        const appointmentDate = new Date(scheduledAt);

        if (isNaN(appointmentDate.getTime())) {
            return NextResponse.json(
                { error: "Data inválida" },
                { status: 400 }
            );
        }

        const barber = await prisma.user.findUnique({
            where: {
                id: barberId
            }
        });

        if (!barber) {
            return NextResponse.json(
                { error: 'Barbeiro não existe' },
                { status: 404 }
            )
        }

        if (barber.role !== "BARBER") {
            return NextResponse.json(
                { error: 'Esse usuário não é barbeiro' },
                { status: 401 }
            )
        }

        const isDuplicateTimeSlot = await prisma.appointment.findFirst({
            where: {
                barberId,
                scheduledAt: appointmentDate
            }
        });

        if (isDuplicateTimeSlot) {
            return NextResponse.json(
                { error: 'Esse horário já está agendado' },
                { status: 400 }
            )
        }

        const services = await prisma.service.findMany({
            where: {
                id: {
                    in: serviceIds
                },
                active: true
            }
        });

        if (services.length !== serviceIds.length) {
            return NextResponse.json(
                { error: 'Serviço não encontrado.' },
                { status: 400 }
            )
        }

        const appointment = await prisma.appointment.create({
            data: {
                userId,
                barberId,
                scheduledAt: appointmentDate,
                status: Status.PENDING
            }
        });

        const appointmentServices = serviceIds.map((serviceId) => {
            return {
                appointmentId: appointment.id,
                serviceId
            };
        });

        await prisma.appointmentService.createMany({
            data: appointmentServices
        })

        return NextResponse.json(
            { message: "Agendamento realizado com sucesso" },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: 'Erro ao fazer o agendamento' },
            { status: 500 }
        )
    }
}