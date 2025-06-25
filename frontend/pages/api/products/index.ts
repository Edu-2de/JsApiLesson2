const apiUrl = process.env.NEXT_PUBLIC_API_URL;

import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false, // Importante para uploads!
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "GET") {
    const response = await fetch(`${apiUrl}/api/products`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  }

  if (req.method === "POST") {
    const body = req.body;
    const response = await fetch(`${apiUrl}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  }

 

  return res.status(405).json({ message: "Method Not Allowed" });
}