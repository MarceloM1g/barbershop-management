"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type ScheduleTime = {
  time: string;
  status: "PAST" | "OCCUPIED" | "BLOCKED" | "AVAILABLE";
};

export default function Availability() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const [scheduleTimes, setScheduleTimes] = useState<ScheduleTime[]>([]);
  const [openTimes, setOpenTimes] = useState(false);
  const [toastError, setToastError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  function toastErrorMessage(text: string) {
    /* setToast('') */
    setToastError(text);

    setTimeout(() => {
      setToastError("");
    }, 3000);
  }

  async function block() {
    try {
      const response = await fetch("/api/blocked-times", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          selectedTimes,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        toastErrorMessage(data?.error ?? "Erro ao cancelar agendamento");
        return;
      }

      alert("Horario bloqueado com sucesso!");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function getAllSlots() {
      try {
        const response = await fetch(`/api/barber/availability?date=${date}`);

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          toastErrorMessage(data?.error ?? "Erro ao listar horários");
          return;
        }

        const data = await response.json();
        setScheduleTimes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    getAllSlots();
  }, [date]);

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) => {
      if (prev.includes(time)) {
        return prev.filter((item) => item !== time);
      }

      return [...prev, time];
    });
  };

  const handleConfirmTimes = () => {
    if (selectedTimes.length === 0) return;

    setOpenTimes(false);
  };

  const handleCloseTimes = () => {
    setSelectedTimes([]);
    setOpenTimes(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
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
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full max-w-2xl rounded-2xl border border-gray-700 bg-[#0f1924] p-8 shadow-xl space-y-4">
          <h1 className="text-2xl font-bold text-white">
            Bloqueio de Horários
          </h1>

          <p className="mt-2 text-white">
            Selecione uma data e os horários que deseja indisponibilizar.
          </p>

          <input
            className="border border-gray-700 bg-gray-900 px-4 py-3 rounded-xl text-gray-300 transition hover:border-gray-500 hover:bg-gray-700 focus:outline-none focus:border-blue-500"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSelectedTimes([]);
            }}
          />

          <button
            type="button"
            onClick={() => setOpenTimes(true)}
            disabled={!date}
            className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-left text-gray-300 transition hover:border-gray-500 hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selectedTimes.length > 0
              ? selectedTimes.join(", ")
              : "Selecione os horários"}
          </button>

          <button
            type="button"
            onClick={() => block()}
            disabled={!date || selectedTimes.length === 0}
            className="w-full rounded-xl bg-red-700 px-4 py-3 text-center text-white transition hover:border-gray-500 hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Bloquear
          </button>

          {openTimes && (
            <div
              onClick={handleCloseTimes}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-800 rounded-xl p-6 shadow-xl w-full max-w-md"
              >
                <button
                  type="button"
                  onClick={handleCloseTimes}
                  className="text-gray-400 hover:text-white transition text-right w-full"
                >
                  ✕
                </button>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Selecione um horário para bloquear
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {scheduleTimes.length > 0 ? (
                    scheduleTimes.map((horario) => {
                      const isSelected = selectedTimes.includes(horario.time);

                      return (
                        <button
                          onClick={() => {
                            if (horario.status !== "AVAILABLE") return;

                            toggleTime(horario.time);
                          }}
                          className={`rounded-lg border px-4 py-3 text-gray-200 transition ${
                            horario.status === "BLOCKED"
                              ? "border-gray-700 bg-red-600 cursor-not-allowed opacity-70"
                              : horario.status === "OCCUPIED"
                                ? "border-gray-700 bg-gray-600 cursor-not-allowed opacity-70"
                                : horario.status === "PAST"
                                  ? "border-gray-700 bg-gray-700 opacity-40 cursor-not-allowed"
                                  : isSelected
                                    ? "border-blue-500 bg-blue-600"
                                    : "border-gray-700 bg-gray-700 hover:border-blue-500 hover:bg-blue-600"
                          }`}
                          type="button"
                          key={horario.time}
                          value={horario.time}
                        >
                          {horario.time}
                        </button>
                      );
                    })
                  ) : (
                    <p className="col-span-3 text-center text-gray-400">
                      Não ha horários para bloquear nesse dia.
                    </p>
                  )}
                </div>
                <button
                  onClick={handleConfirmTimes}
                  disabled={selectedTimes.length === 0}
                  className="w-full bg-[#1a9fff] mt-4 rounded-xl py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Confirmar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
