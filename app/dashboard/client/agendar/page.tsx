"use client";

import { useEffect, useState, useRef } from "react";
import LoadingScreen from "@/components/ui/Loadingscreen";

export default function AgendarPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState("");
  const [toastError, setToastError] = useState("");

  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedTime, setSelectedTime] = useState("");

  const [services, setServices] = useState<Service[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const [openTimes, setOpenTimes] = useState(false);

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

    setToast("");
    setToastError(text);

    timeoutRef.current = setTimeout(() => {
      setToastError("");
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

    setToastError("");
    setToast(text);

    timeoutRef.current = setTimeout(() => {
      setToast("");
    }, 3000);
  }

  useEffect(() => {
    async function loadBarbers() {
      try {
        const response = await fetch("/api/users/barbers", {
          method: "GET",
        });

        if (!response.ok) {
          toastErrorMessage("Erro ao carregar barbeiros");
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
        const response = await fetch("/api/services", {
          method: "GET",
        });

        if (!response.ok) {
          toastErrorMessage("Erro ao carregar serviços");
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
        return prev.filter((serviceId) => serviceId !== id);
      }

      return [...prev, id];
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

    if (selectedBarber === "" || selectedServices.length === 0) {
      toastErrorMessage("Selecione todas as opções");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toastErrorMessage("Selecione uma data e um horário.");
      return;
    }

    setSubmitting(true);

    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`);

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barberId: selectedBarber,
          serviceIds: selectedServices,
          scheduledAt,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        toastErrorMessage(data?.error ?? "Erro ao agendar");
        return;
      }

      toastMessage("Agendado com sucesso!");

      setSelectedBarber("");
      setSelectedServices([]);
      setSelectedDate("");
      setSelectedTime("");
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
        const response = await fetch(
          `/api/appointments/available-times?barberId=${selectedBarber}&date=${selectedDate}`,
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          toastErrorMessage(data?.error ?? "Erro ao listar horários");
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
    <main className="min-h-screen py-6 px-3 sm:py-10 sm:px-4">
      {loading && <LoadingScreen />}

      {toast && (
        <div className="fixed top-20 left-1/2 z-[9999] -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl shadow-xl max-w-sm w-full animate-fade-in">
          {/*                     <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-600 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg> */}
          <span className="text-sm font-medium tracking-wide">{toast}</span>
        </div>
      )}

      {toastError && (
        <div className="fixed top-20 left-1/2 z-[9999] -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-xl max-w-sm w-full animate-fade-in">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-red-600 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <span className="text-sm font-medium tracking-wide">
            {toastError}
          </span>
        </div>
      )}

      <div className="flex items-center justify-center">
        <form
          className="w-full max-w-2xl bg-linear-to-t from-[#02090f] to-[#0a0f16] border border-[#333] rounded-3xl p-5 sm:p-10 shadow-2xl shadow-black/40"
          onSubmit={schedule}
        >
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Novo agendamento
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Escolha o barbeiro, os serviços e o melhor horário para você.
            </p>
          </div>

          {/* Barbeiro */}
          <section className="mb-4">
            <h2 className="text-sm font-semibold uppercase text-gray-400 mb-3">
              Barbeiro
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {barbers.map((barber) => {
                const selected = selectedBarber === barber.id;

                return (
                  <button
                    key={barber.id}
                    className={`flex flex-col items-start rounded-xl mt-2 mb-8 border px-4 py-3 transition-all duration-200 hover:scale-[1.02] active:scale-95
                                    ${selected ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700"}`}
                    type="button"
                    onClick={() => toggleBarber(barber.id)}
                  >
                    <span>{barber.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Serviços */}
          <section className="mb-4">
            <h2 className="text-sm font-semibold uppercase text-gray-400 mb-3">
              Serviços
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((service) => {
                const selected = selectedServices.includes(service.id);

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={`flex flex-col items-start rounded-xl mt-2 mb-8 border px-4 py-3 transition-all duration-200 hover:scale-[1.02] active:scale-95
                                    ${selected ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500 hover:bg-gray-700"}`}
                  >
                    <span className="font-medium">{service.name}</span>

                    <span
                      className={`text-sm ${selected ? "text-blue-100" : "text-gray-400"}`}
                    >
                      R${" "}
                      {Number(service.price).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>

                    <span
                      className={`text-sm ${selected ? "text-blue-100" : "text-gray-400"}`}
                    >
                      {service.duration} min
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Data e Horário */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Data e horário
            </h2>

            <input
              className="w-full border border-gray-700 bg-gray-900 px-4 py-3 rounded-xl text-gray-300 transition hover:border-gray-500 hover:bg-gray-700 focus:outline-none focus:border-blue-500"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setOpenTimes(true)}
              disabled={!selectedBarber}
              className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-left text-gray-300 transition hover:border-gray-500 hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {selectedTime || "Selecione um horário"}
            </button>

            {openTimes && (
              <div
                onClick={() => setOpenTimes(false)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-800 rounded-xl p-6 shadow-xl w-full max-w-md"
                >
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Selecione um horário
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    {availableTimes.map((horario) => (
                      <button
                        onClick={() => {
                          setSelectedTime(horario);
                          setOpenTimes(false);
                        }}
                        className="rounded-lg border border-gray-700 bg-gray-700 px-4 py-3 text-gray-200 transition hover:border-blue-500 hover:bg-blue-600"
                        type="button"
                        key={horario}
                        value={horario}
                      >
                        {horario}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <button
              className="rounded-full bg-[#1a9fff] px-6 py-3 mt-5 mr-5"
              type="submit"
              disabled={submitting}
            >
              {submitting && (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {submitting ? "Agendando..." : "Agendar"}
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
