import { NextResponse } from "next/server";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Aqui você pode chamar sua API backend, ou usar Prisma direto se preferir SSR
  // Exemplo chamando backend Express:
  const res = await fetch(`${apiUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }
  return NextResponse.json(data);
}