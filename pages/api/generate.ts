// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { generate_inputs } from './helpers/generate_input'

type Data = {
	data: any
}

// interface Request extends NextApiRequest {
// 	body: {
// 		signature: string
// 		msg: string
// 		ethAddress: string
// 	}
// }

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { body } = req
	const b = JSON.parse(body)
	console.log("CHECK THERE", b)

	const data = await generate_inputs(b.signature, b.msg, b.ethAddress)
	// const data = await generate_inputs()
	res.status(200).json(data)
}
