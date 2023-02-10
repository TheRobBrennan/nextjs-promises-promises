// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
  timestamp: number;
};

export default function handler(_: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: "Rob Brennan", timestamp: Date.now() });
}
