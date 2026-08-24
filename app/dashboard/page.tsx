import { verifyAuthToken } from "@/lib/auth-token";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const token = (await cookies()).get("token")?.value;
  const user = verifyAuthToken(token);

  if (!user) {
    redirect("/login");
  }

  if (user.role === "BARBER") {
    redirect("/dashboard/barber");
  }

  redirect("/dashboard/client");
}
