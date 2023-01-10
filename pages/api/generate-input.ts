// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { generate_inputs } from "./helpers/generate_input";

type Data = {
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body } = req;
  console.log(body.a);
  const data = await generate_inputs();
  res.status(200).json(data);
}
