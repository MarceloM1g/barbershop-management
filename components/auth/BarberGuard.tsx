"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function BarberGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          router.replace("/login");
          return;
        }

        const user = await response.json();

        if (user.role !== "BARBER") {
          router.replace("/dashboard/client");
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        router.replace("/login");
      }
    }

    checkAuth();

    window.addEventListener("pageshow", checkAuth);

    return () => {
      window.removeEventListener("pageshow", checkAuth);
    };
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Verificando sessão...</p>
      </div>
    );
  }

  return children;
}
