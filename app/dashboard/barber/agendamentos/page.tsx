"use client";

import { useState, useEffect, useRef } from "react";
import LoadingScreen from "@/components/ui/Loadingscreen";
import { Calendar } from "lucide-react";

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
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [toastError, setToastError] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([]);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(
    null,
  );

  function toastErrorMessage(text: string) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    /* setToast('') */
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

  useEffect(() => {
    const loadBarber = async () => {
      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
        });

        if (!response.ok) {
          toastErrorMessage("Erro ao encontrar usuário");
          return;
        }

        const data = await response.json();
        setName(data.name);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadBarber();
  }, []);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const response = await fetch("/api/appointments/barber", {
          method: "GET",
        });

        if (!response.ok) {
          toastErrorMessage("Erro ao carregar agendamentos");
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
      const response = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        toastErrorMessage(data?.error ?? "Erro ao cancelar agendamento");
        return;
      }

      setAppointmentsList((prev) =>
        prev.filter((appointment) => appointment.id !== id),
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="mx-auto mt-5 max-w-7xl px-4">
      {loading && <LoadingScreen />}

      {toastError && (
        <div className="fixed top-20 left-1/2 z-[9999] -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-xl max-w-sm w-full animate-fade-in">
          <svg
            xmlns="http://w3.org"
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

      <div className="mx-auto mt-5 max-w-4xl px-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="text-[#1a9fff]" size={16} />
          <p>Agendamentos</p>
        </div>
        <p className="text-xl mt-3 text-[#f7f7f7]">Agendamentos de {name}</p>
      </div>
      {/* x-auto mt-5 max-w-4xl px-4 relative overflow-hidden rounded-3xl p-10 sm:p-14  bg-linear-to-t from-[#02090f] to-[#0a0f16] border border-[#333] */}
      <div className="mx-auto mt-2 max-w-4xl px-4 relative overflow-hidden rounded-3xl p-2">
        <ul className="mt-6 space-y-4">
          {appointmentsList.map((appointment) => {
            const date = new Date(appointment.scheduledAt);

            return (
              <li
                key={appointment.id}
                className="
          group relative overflow-hidden
          rounded-2xl
          bg-[#0f1924]
          p-5
          shadow-lg shadow-black/20
          transition-all duration-200
          hover:border-white/15
          hover:bg-[#09131c]
        "
              >
                {/* Botão cancelar */}
                <button
                  type="button"
                  onClick={() => setAppointmentToCancel(appointment.id)}
                  aria-label="Cancelar agendamento"
                  className="
            absolute right-4 top-4
            flex h-9 w-9 items-center justify-center
            rounded-lg
            border border-white/5
            bg-white/[0.03]
            text-slate-500
            transition-all
            hover:border-red-500/20
            hover:bg-red-500/10
            hover:text-red-400
          "
                >
                  {/* <X size={17} strokeWidth={2} /> */}
                  ...
                </button>

                {/* Cliente */}
                <div className="pr-12">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-200">
                    Cliente
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-white">
                    {appointment.client.name}
                  </h2>
                </div>

                {/* Data e horário */}
                <div className="mt-5 flex items-center gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#1a9fff]">
                    <Calendar />
                  </div>

                  <div>
                    <p className="text-2xl font-semibold text-slate-200">
                      {date.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    <p className="mt-0.5 text-sm text-slate-400">
                      {date.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                      })}
                    </p>
                  </div>
                </div>

                {/* Serviços */}
                <div className="mt-5 border-t border-white/5 pt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-200">
                    Serviços
                  </p>

                  <div className="text-sm text-slate-300">
                    {appointment.services.map((item, index) => (
                      <span key={item.service.id}>
                        {item.service.name}
                        {index < appointment.services.length - 1 && (
                          <span className="mx-2 text-slate-600">·</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {appointmentToCancel && (
          <div
            onClick={() => setAppointmentToCancel(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="
        w-full max-w-md
        rounded-2xl
        border border-white/10
        bg-[#071018]
        shadow-2xl shadow-black/40
        overflow-hidden
        animate-in fade-in zoom-in-95 duration-200
      "
            >
              {/* Conteúdo */}
              <div className="p-6">
                {/* Ícone */}
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m0 3.75h.008M10.29 3.86l-7.2 12.48A1.5 1.5 0 004.39 18.6h15.22a1.5 1.5 0 001.3-2.26l-7.2-12.48a1.5 1.5 0 00-2.6 0z"
                    />
                  </svg>
                </div>

                <h2 className="text-lg font-semibold text-white">
                  Cancelar agendamento?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Tem certeza que deseja cancelar este agendamento?
                  <br />
                  <span className="text-slate-500">
                    Essa ação não poderá ser desfeita.
                  </span>
                </p>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-end gap-3 border-t border-white/5 bg-white/[0.02] px-6 py-4">
                <button
                  type="button"
                  onClick={() => setAppointmentToCancel(null)}
                  className="
            rounded-xl px-4 py-2.5
            text-sm font-medium text-slate-300
            transition-colors
            hover:bg-white/5 hover:text-white
          "
                >
                  Não, voltar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    cancel(appointmentToCancel);
                    setAppointmentToCancel(null);
                  }}
                  className="
            rounded-xl px-4 py-2.5
            bg-red-500
            text-sm font-semibold text-white
            transition-all
            hover:bg-red-400
            hover:shadow-red-500/30
            active:scale-[0.98]
          "
                >
                  Sim, cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
