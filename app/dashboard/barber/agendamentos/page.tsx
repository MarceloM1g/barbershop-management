"use client"

import { useState, useEffect, useRef } from "react";
import LoadingScreen from "@/components/ui/Loadingscreen";
import { Calendar, X } from "lucide-react";

interface Appointment {
    id: string;
    scheduledAt: string;

    client: {
        name: string;
    };

    services: {
        service: {
            id: string;
            name: string;
            price: string;
        };
    }[];
}

export default function Agendamentos() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [toastError, setToastError] = useState("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([]);

    function toastErrorMessage(text: string) {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        /* setToast('') */
        setToastError(text);

        timeoutRef.current = setTimeout(() => {
            setToastError('');
        }, 3000);
    }

    // limpa o timeout se o componente desmontar antes dos 3s
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const loadBarber = async () => {
            try {
                const response = await fetch('/api/users/me', {
                    method: 'GET',
                });

                if (!response.ok) {
                    toastErrorMessage('Erro ao encontrar usuário');
                    return;
                }

                const data = await response.json();
                setName(data.name);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadBarber();
    }, []);

    useEffect(() => {
        async function loadAppointments() {
            try {
                const response = await fetch('/api/appointments/barber', {
                    method: 'GET'
                });

                if (!response.ok) {
                    toastErrorMessage('Erro ao carregar agendamentos');
                    return;
                }

                const data = await response.json();
                setAppointmentsList(data.appointments);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        loadAppointments();
    }, []);

    async function cancel(id: string) {
        try {
            const response = await fetch('/api/appointments/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                toastErrorMessage(data?.error ?? 'Erro ao cancelar agendamento');
                return;
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <main className="mx-auto mt-5 max-w-7xl px-4">
            {loading && (
                <LoadingScreen />
            )}

            {toastError && (
                <div className="fixed top-20 left-1/2 z-[9999] -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-xl max-w-sm w-full animate-fade-in">
                    <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-600 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span className="text-sm font-medium tracking-wide">
                        {toastError}
                    </span>
                </div>
            )}

            <div className="mx-auto mt-5 max-w-7xl px-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="text-[#1a9fff]" size={16} />
                    <p>Agendamentos</p>
                </div>
                <p className="text-xl mt-3 text-[#f7f7f7]">Agendamentos de {name}</p>
            </div>

            <div className="mx-auto mt-5 max-w-7xl px-4 relative overflow-hidden rounded-3xl p-10 sm:p-14  bg-linear-to-t from-[#02090f] to-[#0a0f16] border border-[#333]">
                <h1 className="text-3xl font-bold mb-8">
                    Agendamentos
                </h1>

                <ul className="mt-2">
                    {appointmentsList.map((appointment) => (
                        <li className="bg-[#02090f] rounded-xl py-8 px-5 mt-5" key={appointment.id}>
                            <button onClick={() => cancel(appointment.id)}><X className="text-[#1a9fff]" size={16} /></button>

                            <h2>
                                {appointment.client.name}
                            </h2>

                            <p>
                                {new Date(appointment.scheduledAt).toLocaleString("pt-BR")}
                            </p>

                            <ul>
                                {appointment.services.map((item) => (
                                    <li key={item.service.id}>{item.service.name}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}