import { NextResponse } from "next/server";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${apiUrl}/api/products/register`, { 
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

export async function GET() {
  const res = await fetch(`${apiUrl}/api/products`);
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }
  return NextResponse.json(data);
}

