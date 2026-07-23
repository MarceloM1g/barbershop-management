"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [toast, setToast] = useState('');
    const [toastError, setToastError] = useState('');

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (email.trim() === '' || password.trim() === '') {
            toastErrorMessage('Preencha todos os campos');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                toastMessage('Usuário logado com sucesso!');
            } else {
                toastErrorMessage(data.error || 'Erro ao fazer login');
                return;
            }

            router.push("/dashboard");

        } catch (error) {
            console.log(error);
            toastErrorMessage('Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    }

    function toastMessage(text: string) {
        setToastError('');
        setToast(text)

        setTimeout(() => {
            setToast('');
        }, 3000);
    }

    function toastErrorMessage(text: string) {
        setToast('')
        setToastError(text)

        setTimeout(() => {
            setToastError('');
        }, 3000);
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">

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
                    <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-600 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span className="text-sm font-medium tracking-wide">
                        {toastError}
                    </span>
                </div>
            )}

            <div className="w-full max-w-md bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-8 shadow-xl">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#eee]">
                        Iniciar sessão
                    </h1>

                    <p className="text-zinc-400 mt-2">
                        Preencha os dados para começar.
                    </p>
                </div>

                <form onSubmit={login} className="space-y-5">
                    <div>
                        <label className="block text-sm text-zinc-300 mb-2">
                            E-mail
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.currentTarget.value)}
                            placeholder="seuemail@email.com"
                            className="w-full px-4 py-3 bg-[#111] border border-zinc-700 rounded-xl text-white outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-zinc-300 mb-2">
                            Senha
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
                            placeholder="********"
                            className="w-full px-4 py-3 bg-[#111] border border-zinc-700 rounded-xl text-white outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-full bg-white text-black font-semibold hover:bg-blue-400 hover:text-white transition"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>

                </form>
                <div className="mt-6 text-center text-zinc-400">
                    Não possui uma conta?{" "}
                    <Link
                        href="/register"
                        className="text-blue-400 hover:text-blue-300"
                    >
                        Criar uma Conta
                    </Link>
                </div>
            </div>
        </div>
    );
}