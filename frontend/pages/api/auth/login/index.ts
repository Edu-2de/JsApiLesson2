const apiUrl = process.env.NEXT_PUBLIC_API_URL;

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Para pegar o body em API Route tradicional:
  const body = req.body;

  // Se precisar garantir que é JSON:
  // const body = typeof req.body === "object" ? req.body : JSON.parse(req.body);

  const response = await fetch(`${apiUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  res.status(response.status).json(data);
}