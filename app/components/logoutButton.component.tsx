"use client";

import { cn } from "@/lib/utils";

export function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/admin-logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <button
      onClick={handleLogout}
      className={cn(
        "p-4 hover:bg-secondary hover:text-secondary-foreground"
      )}
    >
      Logout
    </button>
  );
}
