"use client"

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/ui/Loadingscreen";
import { House } from "lucide-react";
import Link from 'next/link';

export default function ClientPage() {
    const [name, setName] = useState('');
    const [toastError, setToastError] = useState('');
    const [loading, setLoading] = useState(true);

    function toastErrorMessage(text: string) {
        /* setToast('') */
        setToastError(text)

        setTimeout(() => {
            setToastError('');
        }, 3000);
    }

    useEffect(() => {
        const loadUser = async () => {
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

        loadUser();
    }, []);

    return (
        <div>
            {loading && (
                <LoadingScreen />
            )}

            {/*             {toast && (
                <div className="fixed top-20 left-1/2 z-[9999] -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl shadow-xl max-w-sm w-full animate-fade-in">
                    <span className="text-sm font-medium tracking-wide">
                        {toast}
                    </span>
                </div>
            )} */}

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
                    <House className="text-[#1a9fff]" size={16} />
                    <p>Início</p>
                </div>
                <p className="text-xl mt-3 text-[#f7f7f7]">Olá, {name}</p>
            </div>

            <div className="mx-auto mt-8 max-w-7xl px-4">
                <div className="relative overflow-hidden rounded-3xl p-10 sm:p-14  bg-linear-to-t from-[#02090f] to-[#0a0f16] border border-[#333]">

                    <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full" />

                    <div className="relative">

                        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                            Agende seu horário
                        </h1>

                        <p className="mt-4 max-w-md text-zinc-400">
                            Escolha uma data disponível e confirme seu atendimento em poucos segundos.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <Link
                                href="/dashboard/client/agendar"
                                className="rounded-full bg-[#1a9fff] px-6 py-3 font-semibold text-[#f7f7f7] transition hover:bg-[#56abff] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                            >
                                Agendar horário
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}