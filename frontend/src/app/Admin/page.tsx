"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
    if (!user || user.role !== "admin") {
      router.replace("/Login");
    }
  }, [router]);

  return (
    <div>
      <h1>Página de Admin</h1>
      {/* Conteúdo restrito */}
    </div>
  );
}