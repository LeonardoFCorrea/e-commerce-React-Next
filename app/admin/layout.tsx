import React from "react";
import { Nav, NavLink } from "../components/nav.component";
import { LogoutButton } from "../components/logoutButton.component";

export const dynamic = "force-dynamic";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return <>
    <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink> 
        <LogoutButton />
    </Nav>
    <div className="container mx-auto my-6 px-4">{children}</div>    
    </>
}