import ClientGuard from "@/components/auth/ClientGuard";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientGuard>{children}</ClientGuard>;
}
