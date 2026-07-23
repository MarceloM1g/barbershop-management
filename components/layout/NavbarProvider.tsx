"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import DashboardNavbar from "./DashboardNavbar";

export default function NavbarProvider() {
    const pathname = usePathname();

    if (pathname.startsWith("/dashboard")) {
        return <DashboardNavbar />;
    }

    return <Navbar />;
}