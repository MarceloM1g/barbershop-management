"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState('');
    const [toastError, setToastError] = useState('');

    const router = useRouter();

    async function register(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (name.trim() === '' || email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
            toastErrorMessage('Preencha todos os campos');
            return;
        }

        if (password.length < 6) {
            toastErrorMessage('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            toastErrorMessage('As senhas não coincidem');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                toastErrorMessage(data.error || 'Erro ao criar conta');
                return;
            } else {
                toastMessage('Usuário registrado com sucesso!');

                setName('')
                setEmail('')
                setPassword('')
                setConfirmPassword('');

                setTimeout(() => {
                    router.push('/login');
                }, 1000);
            }

        } catch (error) {
            console.log(error);
            toastErrorMessage('Erro ao conectar com o servidor');
        } finally {
            setLoading(false)
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
                        Criar Conta
                    </h1>

                    <p className="text-zinc-400 mt-2">
                        Preencha os dados para começar.
                    </p>
                </div>

                <form onSubmit={register} className="space-y-5">

                    <div>
                        <label className="block text-sm text-zinc-300 mb-2">
                            Nome
                        </label>

                        <input
                            type="text"
                            placeholder="Seu nome"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
                            className="w-full px-4 py-3 bg-[#111] border border-zinc-700 rounded-xl text-white outline-none focus:border-blue-500 transition"
                        />
                    </div>

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

                    <div>
                        <label className="block text-sm text-zinc-300 mb-2">
                            Confirmar Senha
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.currentTarget.value)}
                            placeholder="********"
                            className="w-full px-4 py-3 bg-[#111] border border-zinc-700 rounded-xl text-white outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-full font-semibold transition ${loading ? "bg-zinc-500 text-zinc-300 cursor-not-allowed" : "bg-white text-black hover:bg-blue-400 hover:text-white"} `}                       
                    >
                        {loading ? 'Criando...' : 'Criar Conta'}
                    </button>

                </form>

                <div className="mt-6 text-center text-zinc-400">
                    Já possui uma conta?{" "}
                    <Link
                        href="/login"
                        className="text-blue-400 hover:text-blue-300"
                    >
                        Entrar
                    </Link>
                </div>

            </div>
        </div>
    );
}