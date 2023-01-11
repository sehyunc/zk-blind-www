// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
	configureChains,
	createClient,
	goerli,
	readContract
} from '@wagmi/core'
import { InjectedConnector } from '@wagmi/core/connectors/injected'
import { publicProvider } from '@wagmi/core/providers/public'
import type { NextApiRequest, NextApiResponse } from 'next'
import Inputs from './inputs.json'
const snarkjs = require('snarkjs')

const { chains, provider, webSocketProvider } = configureChains(
	[goerli],
	[publicProvider()]
)

const client = createClient({
	autoConnect: true,
	connectors: [new InjectedConnector({ chains })],
	provider,
	webSocketProvider
})

type Data = {
	valid: boolean
}

export async function verifyProof(proof: any, publicSignals: any) {
	const proofVerified = await snarkjs.groth16.verify(vkey, publicSignals, proof)

	return !!proofVerified
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const body = {
		signature:
			'mLCysHQtDftfFey4F-ntFma22r5-qpxtkXsiDw6TY30Tnoj2kPQ_YdSjzagrwRgF7pHE8SSM_roo2wDh3c_8vDNRZeax4VICZjYmPS-3ZWAV0XyjjlgWgFleTqVT72M-VlPCdecHiYQJojlYHJyGybvTCaX1cqoF9aAMy8wBvRbSceECmX15k4nKG51Z5Le7k_vOShaxYmwrRhMIip4KRv-DW1FXAdi_F-MYSrqZ6Oq-nglMujxD2NOoHoqOqmyd1OMIrc6oIRuRqBXlRnQ0IdUDQbiXfyFVC0ItIME3a4SLoWp_rrmY1tSrGJu93MZrjhzfkNglJ-FOp4kKZAKkzA',
		msg: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJzZWh5dW5AYmVya2VsZXkuZWR1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImdlb2lwX2NvdW50cnkiOiJVUyJ9LCJodHRwczovL2FwaS5vcGVuYWkuY29tL2F1dGgiOnsidXNlcl9pZCI6InVzZXIta1dMaXBzT3dMZFd4MXdMc0I3clR3UnFlIn0sImlzcyI6Imh0dHBzOi8vYXV0aDAub3BlbmFpLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNjYwOTg2MjEwMzkxMTMwNjgwNyIsImF1ZCI6WyJodHRwczovL2FwaS5vcGVuYWkuY29tL3YxIiwiaHR0cHM6Ly9vcGVuYWkuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY3MzE1NTQ0NiwiZXhwIjoxNjczNzYwMjQ2LCJhenAiOiJUZEpJY2JlMTZXb1RIdE45NW55eXdoNUU0eU9vNkl0RyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgbW9kZWwucmVhZCBtb2RlbC5yZXF1ZXN0IG9yZ2FuaXphdGlvbi5yZWFkIG9mZmxpbmVfYWNjZXNzIn0',
		ethAddress: '0x0000000000000000000000000000000000000000'
	}
	const inputs = await fetch('http://localhost:3000/api/generate', {
		method: 'POST',
		body: JSON.stringify(body)
	}).then(res => res.json())

	console.log('🚀 ~ inputs', inputs)

	const { proof, publicSignals } = await snarkjs.groth16.fullProve(
		inputs,
		'/Users/sehyun/Downloads/jwt.wasm',
		'/Users/sehyun/Downloads/jwt_single1.zkey'
	)
	console.log('proof', proof)
	console.log('publicSignals', publicSignals)
	const proofJson = JSON.stringify(proof)
	let kek = publicSignals.map((x: string) => BigInt(x))
	const publicSignalsJson = JSON.stringify(kek)

	const isVerified = await verifyProof(
		JSON.parse(proofJson),
		JSON.parse(publicSignalsJson)
	)

	res.status(200).json({ valid: isVerified })
}

// const abi = [
// 	{
// 		inputs: [
// 			{ internalType: 'uint256[2]', name: 'a', type: 'uint256[2]' },
// 			{ internalType: 'uint256[2][2]', name: 'b', type: 'uint256[2][2]' },
// 			{ internalType: 'uint256[2]', name: 'c', type: 'uint256[2]' },
// 			{ internalType: 'uint256[1]', name: 'input', type: 'uint256[1]' }
// 		],
// 		name: 'verifyProof',
// 		outputs: [{ internalType: 'bool', name: 'r', type: 'bool' }],
// 		stateMutability: 'view',
// 		type: 'function'
// 	}
// ]
// const data = await readContract({
// 	address: '0xF545e558E137C1C52fcE3Ea528E045462a9C3641',
// 	abi,
// 	functionName: 'verifyProof',
// 	args: newArgs
// })
// console.log("🚀 ~ data", data);
// const data = false

// const newArgs = [
// 	[
// 		'0x301baee8285e9861a01a4ac309b1aa5afae52553ff57d1161a38bb33c44292c2',
// 		'0x2dd313fbff534049064bab83c2d905d3587070d3d18f1dde7d1fe68f40ebcbcb'
// 	],
// 	[
// 		[
// 			'0x2734cf04cb8bc58069da1a0ef353d6a9990a5fc674ca67287dd8521a2c7caad1',
// 			'0x2ad69322a693dc616b8e74d3f64cb7e9e69309dd9f628a1a83e374c5731cd413'
// 		],
// 		[
// 			'0x1b147a43a077eacc91a50faa0a236b9a98f102428db39839f74942e76256892f',
// 			'0x08f0ad2f8b81a92be449117b5683bc4b4470813ed52f25d2daa3bb7547a18951'
// 		]
// 	],
// 	[
// 		'0x0c31e4b39873d285d0a0083da184d275e66835f03a845fc04c942c97a4091cf9',
// 		'0x2044e2da5d7628a1101f0c1f5df44969f5e9cdc78255d3d89183468a179a1745'
// 	],
// 	[
// 		'0x0000000000000000000000000000000000c8430c6464e64ddda07a9b863d8881',
// 		'0x0000000000000000000000000000000001cd0da2c4ae4218b0cade824b613b37',
// 		'0x000000000000000000000000000000000062e5c346b31c47a050182d2eafd848',
// 		'0x00000000000000000000000000000000000618669ce3a3538eaddc8d6ced08b9',
// 		'0x0000000000000000000000000000000000d75cdc8d790c81ab9c23625464a414',
// 		'0x00000000000000000000000000000000011954a4b6d45c95fa48f63ffec9f0ad',
// 		'0x0000000000000000000000000000000001e075c1b0cf7069eac655ee53f6cb80',
// 		'0x000000000000000000000000000000000060409af02b53bf34965950c557a044',
// 		'0x000000000000000000000000000000000016b77d2e3917ea5af4e7363a68cffe',
// 		'0x00000000000000000000000000000000007283ffb204c691aaf1bce0ac279328',
// 		'0x0000000000000000000000000000000001785e45f8b6da078bb330084a557dbd',
// 		'0x00000000000000000000000000000000003520db147c498f546c95853efc64f3',
// 		'0x0000000000000000000000000000000001a652f8aede242fe83a7af1091cc560',
// 		'0x000000000000000000000000000000000177e578067b3fc1873b4838e2597d79',
// 		'0x000000000000000000000000000000000082c7f533459aff65a02e6f635fae51',
// 		'0x0000000000000000000000000000000000a00bcf4e84dc9a972a8eab541dfb33',
// 		'0x000000000000000000000000000000000000dbbace12b0ce3ef3dcde63800d8b',
// 		'0x0000000000000000000000000000000000000000000000000000000000000000'
// 	]
// ]

// const oldArgs = [
// 	[
// 		'0x05c6b8c5586d473ac18f166c7293f179ae321aa66eb7781a566e18b18cfa201c',
// 		'0x16110cdea1999b371f1039b80c02c46bd0497ae24370ea1ca589f4957bf6bcfb'
// 	],
// 	[
// 		[
// 			'0x11e07b2879b5d400ef3e59b6298470064446162010cb949e58a734c0ac731474',
// 			'0x1b4b93e61b502d005f4ddcf5fecd48c0c362acac0c055cc8e0c15a2070ce0d69'
// 		],
// 		[
// 			'0x2e7b01faa29c857f5074afcecaca244a0a298c2bd21bbe78a1dc8e571c2317fa',
// 			'0x02f3c03c5f3b778c1e5364ccfada6a8216eb7f477c698d33106571727e4845ad'
// 		]
// 	],
// 	[
// 		'0x1eb2b326c3e0a3294718954d4a766000caba888e406e10a988ed568c81131aed',
// 		'0x2f67225076ddf6c1f269bbca617d635eec458b44b0eae9fdb070d1b228d13a29'
// 	],
// 	['0x2323966c7385a437ec039864aa44a153587a402717f8bfe53741eb490f9935c8']
// ]

// const input = {
// 	x: '1764'
// }
