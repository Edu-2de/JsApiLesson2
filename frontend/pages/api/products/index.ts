const apiUrl = process.env.NEXT_PUBLIC_API_URL;

import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false, // Importante para uploads!
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Proxy multipart para o backend
    const response = await fetch(`${apiUrl}/api/products/register`, {
      method: "POST",
      headers: {
        authorization: req.headers.authorization || "",
        // NÃO coloque 'Content-Type' aqui!
      },
      body: req, // repassa o stream
      duplex: "half",
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  }

  if (req.method === "GET") {
    const response = await fetch(`${apiUrl}/api/products`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    const { id } = req.query;
    const body = req.body;
    const response = await fetch(`${apiUrl}/api/products/${id}`, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  }

  // Se quiser tratar GET_BY_ID, crie uma rota separada: pages/api/products/[id].ts

  return res.status(405).json({ message: "Method Not Allowed" });
}