import type { NextApiRequest, NextApiResponse } from "next";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    const response = await fetch(`${apiUrl}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        authorization: Array.isArray(req.headers.authorization)
          ? req.headers.authorization[0]
          : req.headers.authorization ||
            (Array.isArray(req.headers.Authorization)
              ? req.headers.Authorization[0]
              : req.headers.Authorization) ||
            "",
      },
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  }

  if (req.method === "PUT") {
    const { id } = req.query;
    let body = req.body;
    // Garante que o body seja um objeto (parse se vier como string)
    if (typeof body === "string") {
      body = JSON.parse(body);
    }
    const response = await fetch(`${apiUrl}/api/products/${id}`, {
      method: "PUT",
      headers: {
        authorization: Array.isArray(req.headers.authorization)
          ? req.headers.authorization[0]
          : req.headers.authorization ||
            (Array.isArray(req.headers.Authorization)
              ? req.headers.Authorization[0]
              : req.headers.Authorization) ||
            "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  }

  if (req.method === "GET") {
    const response = await fetch(`${apiUrl}/api/products/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}