"use client"

import { useState } from "react";
import Link from "next/link";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed left-0 top-0 z-50 w-full bg-[#111] text-[#eee]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="text-xl font-bold uppercase">
                        <Link href="/">
                            Logo
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-6">
                        <Link href="/" className="hover:text-blue-400">Home</Link>
                        {/* <Link href="/sobre" className="hover:text-blue-400">About</Link> */}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login" className="px-4 py-2 font-bold hover:text-blue-400">
                            Entrar
                        </Link>

                        <Link href="/register" className="border rounded-xl px-4 py-2 hover:bg-white hover:text-black transition">
                            Criar uma Conta
                        </Link>
                    </div>

                    {/* Hambúrguer */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? "✕" : "☰"}
                    </button>

                </div>

                {isOpen && (
                    <div className="md:hidden flex flex-col gap-4 py-4">
                        <a href="#" className="block py-2 hover:text-blue-400 hover:text-blue-400">Home</a>
                        <a href="#" className="block py-2 hover:text-blue-400 hover:text-blue-400">About</a>

                        <button className="text-left hover:text-blue-400">
                            Entrar
                        </button>

                        <button className="border rounded-xl px-4 py-2 w-fit">
                            Criar uma Conta
                        </button>
                    </div>
                )}

            </div>
        </nav>
    );
}

export default Navbar;