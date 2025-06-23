"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
    if (!user || user.role !== "admin") {
      router.replace("/Login");
    }
  }, [router]);

  return (
    <>
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <Link href="/Admin/Products" className="text-blue-500 hover:underline">Manage Products</Link>
    </div>
    </>
  );
}