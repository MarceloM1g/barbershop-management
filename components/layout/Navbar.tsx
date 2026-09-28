"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="h-20 bg-[#171D25] border-b border-[#333]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="text-xl font-bold uppercase">
          <Link href="/">
            <Image src={Logo} width={70} height={70} alt="Logo" />
          </Link>
        </div>

        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-blue-400">
            Home
          </Link>
          {/* <Link href="/sobre" className="hover:text-blue-400">About</Link> */}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 font-bold hover:text-blue-400"
          >
            Entrar
          </Link>

          <Link
            href="/register"
            className="border rounded-xl px-4 py-2 hover:bg-white hover:text-black transition"
          >
            Criar uma Conta
          </Link>

          {/* Hambúrguer */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden flex flex-col gap-4 py-4">
            <a
              href="#"
              className="block py-2 hover:text-blue-400 hover:text-blue-400"
            >
              Home
            </a>
            <a
              href="#"
              className="block py-2 hover:text-blue-400 hover:text-blue-400"
            >
              About
            </a>

            <button className="text-left hover:text-blue-400">Entrar</button>

            <button className="border rounded-xl px-4 py-2 w-fit">
              Criar uma Conta
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
