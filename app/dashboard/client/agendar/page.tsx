"use client"

import { useEffect, useState, useRef } from "react";
import LoadingScreen from "@/components/ui/Loadingscreen";

export default function AgendarPage() {
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState('');
    const [toastError, setToastError] = useState("");

    const [selectedBarber, setSelectedBarber] = useState("");
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [selectedTime, setSelectedTime] = useState("");

    const [services, setServices] = useState<Service[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [availableTimes, setAvailableTimes] = useState([]);

    interface Service {
        id: string;
        name: string;
        price: string;
        duration: number;
        description?: string;
    }

    interface Barber {
        id: string;
        name: string;
        email: string;
    }

    function toastErrorMessage(text: string) {
        // Se tiver aparecendo o toast na tela e o usuarío clicar dnv, remove o time e logo em seguida aparece outro
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setToast('');
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

    function toastMessage(text: string) {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setToastError('');
        setToast(text)

        timeoutRef.current = setTimeout(() => {
            setToast('');
        }, 3000);
    }

    useEffect(() => {
        async function loadBarbers() {
            try {
                const response = await fetch('/api/users/barbers', {
                    method: 'GET',
                });

                if (!response.ok) {
                    toastErrorMessage('Erro ao carregar barbeiros');
                    return;
                }

                const data = await response.json();
                setBarbers(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadBarbers();
    }, []);

    useEffect(() => {
        async function loadServices() {
            try {
                const response = await fetch('/api/services', {
                    method: 'GET'
                });

                if (!response.ok) {
                    toastErrorMessage('Erro ao carregar serviços');
                    return;
                }

                const data = await response.json();
                setServices(data.services);

            } catch (error) {
                console.log(error);
            }
        }

        loadServices();
    }, []);

    function toggleBarber(id: string) {
        setSelectedBarber((prev) => (prev === id ? "" : id));
    }

    function toggleService(id: string) {
        setSelectedServices((prev) => {
            if (prev.includes(id)) {
                return prev.filter(serviceId => serviceId !== id);
            }

            return [...prev, id]
        });
    }

    const totalPrice = services.reduce((total, service) => {
        if (selectedServices.includes(service.id)) {
            return total + Number(service.price);
        }

        return total;
    }, 0);

    async function schedule(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (submitting) return;

        if (selectedBarber === '' || selectedServices.length === 0) {
            toastErrorMessage('Selecione todas as opções')
            return;
        }

        if (!selectedDate || !selectedTime) {
            toastErrorMessage("Selecione uma data e um horário.");
            return;
        }

        setSubmitting(true);

        try {
            const scheduledAt = new Date(
                `${selectedDate}T${selectedTime}:00`
            );

            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    barberId: selectedBarber,
                    serviceIds: selectedServices,
                    scheduledAt
                })
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                toastErrorMessage(data?.error ?? 'Erro ao agendar');
                return;
            }

            toastMessage('Agendado com sucesso!');

        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        if (!selectedBarber || !selectedDate) return;

        async function getAvailableTimeSlots() {
            try {
                const response = await fetch(`/api/appointments/available-times?barberId=${selectedBarber}&date=${selectedDate}`);

                if (!response.ok) {
                    const data = await response.json().catch(() => null);
                    toastErrorMessage(data?.error ?? 'Erro ao listar horários');
                    return;
                }

                const data = await response.json();
                setAvailableTimes(data);

            } catch (error) {
                console.error(error);
            }
        }

        getAvailableTimeSlots();

    }, [selectedBarber, selectedDate]);

    return (
        <main className="min-h-screen py-8 px-4">

            {loading && (
                <LoadingScreen />
            )}

            {toast && (
                <div className="fixed top-20 left-1/2 z-[9999] -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl shadow-xl max-w-sm w-full animate-fade-in">
                    {/*                     <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-600 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg> */}
                    <span className="text-sm font-medium tracking-wide">
                        {toast}
                    </span>
                </div>
            )}

            {toastError && (
                <div className="fixed top-20 left-1/2 z-[9999] -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-xl max-w-sm w-full animate-fade-in">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-600 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span className="text-sm font-medium tracking-wide">
                        {toastError}
                    </span>
                </div>
            )}

            <div className="flex items-center justify-center">
                <form className="bg-linear-to-t from-[#02090f] to-[#0a0f16] border border-[#333] rounded-3xl p-10" onSubmit={schedule}>
                    <h1>Barbeiro</h1>
                    <div className="flex flex-colum">
                        {barbers.map((barber) => {
                            const selected = selectedBarber === barber.id;

                            return (
                                <button
                                    key={barber.id}
                                    className={`flex flex-col items-start rounded-xl mt-2 mb-8 border px-4 py-3 transition-all duration-200 hover:scale-[1.02] active:scale-95
                                    ${selected ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700"}`}
                                    type="button"
                                    onClick={() => toggleBarber(barber.id)}>

                                    <span>
                                        {barber.name}
                                    </span>

                                </button>
                            )
                        })}
                    </div>

                    <h1>Selecione os serviços desejado:</h1>
                    <div className="flex flex-wrap gap-3">
                        {services.map((service) => {
                            const selected = selectedServices.includes(service.id);

                            return (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => toggleService(service.id)}
                                    className={`flex flex-col items-start rounded-xl mt-2 mb-8 border px-4 py-3 transition-all duration-200 hover:scale-[1.02] active:scale-95
                                    ${selected ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700"}`}>

                                    <span className="font-medium">
                                        {service.name}
                                    </span>

                                    <span
                                        className={`text-sm ${selected ? "text-blue-100" : "text-gray-400"}`}>
                                        R$ {Number(service.price).toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>

                                    <span
                                        className={`text-sm ${selected ? "text-blue-100" : "text-gray-400"}`}>
                                        {service.duration} min
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <input
                            className="border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700 mt-2 mb-8 border px-4 py-3 rounded-xl"
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />

                        <select
                            className="border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700 mt-2 mb-8 border px-4 py-3 rounded-xl"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        >
                            <option value="">Selecione um horário</option>
                            {availableTimes.map((horario) => (
                                <option key={horario} value={horario}>
                                    {horario}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center">
                        <button className="rounded-full bg-[#1a9fff] px-6 py-3 mt-5 mr-5" type="submit" disabled={submitting}>
                            {submitting && (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {submitting ? 'Agendando...' : 'Agendar'}
                        </button>
                        <h2 className="px-6 py-3 mt-5">
                            Valor total:{" "}
                            {totalPrice.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                        </h2>
                    </div>
                </form>
            </div>
        </main>
    );
}