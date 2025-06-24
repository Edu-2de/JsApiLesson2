import { NextResponse } from "next/server";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const res = await fetch(`${apiUrl}/api/products/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }
  return NextResponse.json(data);
}
