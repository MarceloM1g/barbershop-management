import BarberGuard from "@/components/auth/BarberGuard";

export default function BarberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BarberGuard>{children}</BarberGuard>;
}
