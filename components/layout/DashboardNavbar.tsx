"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setName(data.name);
      } catch (error) {
        console.error(error);
      }
    };

    loadUser();
  }, []);

  async function logout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
      } else {
        alert("Erro ao sair");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="h-20 bg-[#171D25] border-b border-[#333]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link href="/">
          <Image src={Logo} width={70} height={70} alt="Logo" />
        </Link>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-zinc-800 transition"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-700">
              {name ? name[0].toUpperCase() : ""}
            </div>

            <span className="font-medium">{name}</span>

            <span className="text-sm">▼</span>
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-lg border border-[#333] bg-[#171D25] shadow-xl p-2">
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-800 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
