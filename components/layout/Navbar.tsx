"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="relative h-20 bg-[#171D25] border-b border-[#333]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="text-xl font-bold uppercase">
          <Link href="/" onClick={closeMenu}>
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
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      <div
        className={`md:hidden absolute left-0 right-0 top-full z-50 grid bg-[#171D25] transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 visible border-b border-[#333]"
            : "grid-rows-[0fr] opacity-0 invisible"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 px-6 py-4">
            <Link
              href="/"
              onClick={closeMenu}
              className="py-2 hover:text-blue-400"
            >
              Home
            </Link>

            <Link
              href="/login"
              onClick={closeMenu}
              className="py-2 font-bold hover:text-blue-400"
            >
              Entrar
            </Link>

            <Link
              href="/register"
              onClick={closeMenu}
              className="border rounded-xl px-4 py-2 w-fit hover:bg-white hover:text-black transition"
            >
              Criar uma Conta
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
