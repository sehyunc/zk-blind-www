// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { vkey } from './constants/vkey'
const snarkjs = require('snarkjs')

type Data = {
  isVerified: boolean
}

export async function verifyProof(proof: any, publicSignals: any) {
  const proofVerified = await snarkjs.groth16.verify(vkey, publicSignals, proof)
  return proofVerified
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body } = req
  const b = JSON.parse(body)

  const isVerified = await verifyProof(b.proof, b.publicInputs)
  res.status(200).json({ isVerified })
}
