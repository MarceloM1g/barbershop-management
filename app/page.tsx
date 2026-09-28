import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.png";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 text-white">
      <section className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <Image
          src={Logo}
          width={200}
          height={200}
          alt="Foto de perfil do autor"
        />

        <p className="text-base text-white sm:text-2xl">
          Agende seu horário online de forma rápida e escolha o melhor momento
          para cuidar do seu visual.
        </p>

        <Link
          href="/register"
          className="rounded-lg border-2 border-[#1a9fff] px-8 py-3 font-semibold text-white transition hover:bg-[#1a9fff] hover:border-[#111]"
        >
          Criar uma conta
        </Link>
      </section>
    </main>
  );
}
