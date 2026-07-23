import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, type AuthRole } from "@/lib/auth-token";

function redirectToDashboardByRole(request: NextRequest, role: AuthRole) {
    if (role === "CLIENT") {
        return NextResponse.redirect(new URL("/dashboard/client", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard/barber", request.url));
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;
    const user = verifyAuthToken(token);

    if (pathname === '/login' || pathname === '/register' || pathname === '/') {
        if (!user) {
            return NextResponse.next();
        }

        return redirectToDashboardByRole(request, user.role);
    }

    if (pathname.startsWith("/dashboard")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (pathname === "/dashboard/client" && user.role !== "CLIENT" || pathname === "/dashboard/client/agendar" && user.role !== "CLIENT") {
            return redirectToDashboardByRole(request, user.role);
        }

        if (pathname === "/dashboard/barber" && user.role !== "BARBER") {
            return redirectToDashboardByRole(request, user.role);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*", "/login", "/register"],
}