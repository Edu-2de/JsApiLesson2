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
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">Página de Admin</h1>
    </div>
  );
}