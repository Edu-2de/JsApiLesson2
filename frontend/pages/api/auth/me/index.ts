import type { NextApiRequest, NextApiResponse } from "next";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Encaminha o token para o backend
  const response = await fetch(`${apiUrl}/api/auth/me`, {
    method: "GET",
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
  });
  const data = await response.json();
  return res.status(response.status).json(data);
}