// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getContract } from '@wagmi/core'
import { ethers } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
const snarkjs = require('snarkjs')
import { BigNumber } from 'ethers'

const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_verifier',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'uint256[2]',
        name: 'a',
        type: 'uint256[2]'
      },
      {
        internalType: 'uint256[2][2]',
        name: 'b',
        type: 'uint256[2][2]'
      },
      {
        internalType: 'uint256[2]',
        name: 'c',
        type: 'uint256[2]'
      },
      {
        internalType: 'uint256[48]',
        name: 'input',
        type: 'uint256[48]'
      }
    ],
    name: 'add',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'companies',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address'
      }
    ],
    name: 'get',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'verifier',
    outputs: [
      {
        internalType: 'contract Verifier',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC, 5)
const signer = new ethers.Wallet(process.env.PRIVKEY as any, provider)

const contract = getContract({
  address: '0x13e4E0a14729d9b7017E77ebbDEad05cb8ad1540',
  abi: abi,
  signerOrProvider: signer
})

type Data = {
  hash: string
}
// const inputs = [
//   [
//     '0x0a08163c892e678e5aa9a8aaa6711588a27048bd854694b27cc437b2e4671908',
//     '0x241c35d4ecd96a287026fc26dff3d4aacbe4e6774b43a1cb4447a6b7542362cd'
//   ],
//   [
//     [
//       '0x16494aec6bc66ef3c5367caa40e87ddc6295ebd17ef74d1d4909d746cb6d4781',
//       '0x2e7be4557581ca692d289e3773946ccf99694d8f35f9ac2bb1ce4518e48bba6f'
//     ],
//     [
//       '0x046ea21dbd94f313e4283a90cc5d8bd86e62070756b4165ebf5f0ffc59d45f53',
//       '0x166a35b44e322094265129f1351a3b22a492eed10654d6b568a507483ffe6e75'
//     ]
//   ],
//   [
//     '0x0e7cfa258e280d620949b5cbd8f905d9bc781e4816ac3021ab8f94952d9af702',
//     '0x2ec3a0ba5286757371f92aeb6b347763b5e19b544a9616198a57fb7e758e5456'
//   ],
//   [
//     '0x0000000000000000000000000000000000c8430c6464e64ddda07a9b863d8881',
//     '0x0000000000000000000000000000000001cd0da2c4ae4218b0cade824b613b37',
//     '0x000000000000000000000000000000000062e5c346b31c47a050182d2eafd848',
//     '0x00000000000000000000000000000000000618669ce3a3538eaddc8d6ced08b9',
//     '0x0000000000000000000000000000000000d75cdc8d790c81ab9c23625464a414',
//     '0x00000000000000000000000000000000011954a4b6d45c95fa48f63ffec9f0ad',
//     '0x0000000000000000000000000000000001e075c1b0cf7069eac655ee53f6cb80',
//     '0x000000000000000000000000000000000060409af02b53bf34965950c557a044',
//     '0x000000000000000000000000000000000016b77d2e3917ea5af4e7363a68cffe',
//     '0x00000000000000000000000000000000007283ffb204c691aaf1bce0ac279328',
//     '0x0000000000000000000000000000000001785e45f8b6da078bb330084a557dbd',
//     '0x00000000000000000000000000000000003520db147c498f546c95853efc64f3',
//     '0x0000000000000000000000000000000001a652f8aede242fe83a7af1091cc560',
//     '0x000000000000000000000000000000000177e578067b3fc1873b4838e2597d79',
//     '0x000000000000000000000000000000000082c7f533459aff65a02e6f635fae51',
//     '0x0000000000000000000000000000000000a00bcf4e84dc9a972a8eab541dfb33',
//     '0x000000000000000000000000000000000000dbbace12b0ce3ef3dcde63800d8b',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000062',
//     '0x0000000000000000000000000000000000000000000000000000000000000065',
//     '0x0000000000000000000000000000000000000000000000000000000000000072',
//     '0x000000000000000000000000000000000000000000000000000000000000006b',
//     '0x0000000000000000000000000000000000000000000000000000000000000065',
//     '0x000000000000000000000000000000000000000000000000000000000000006c',
//     '0x0000000000000000000000000000000000000000000000000000000000000065',
//     '0x0000000000000000000000000000000000000000000000000000000000000079',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x0000000000000000000000000000000000000000000000000000000000000000'
//   ]
// ]

export async function exportSolidityCallDataGroth16({
  proof,
  publicSignals
}: any) {
  console.log('🚀 ~ publicSignals', publicSignals.length)
  const rawCallData: string = await snarkjs.groth16.exportSolidityCallData(
    proof,
    publicSignals
  )
  //   console.log('🚀 ~ rawCallData', typeof rawCallData)
  const tokens = rawCallData
    .replace(/["[\]\s]/g, '')
    .split(',')
    .map(x => BigNumber.from(x).toHexString())
  const [a1, a2, b1, b2, b3, b4, c1, c2, ...inputs] = tokens
  const a = [a1, a2] satisfies [string, string]
  const b = [
    [b1, b2],
    [b3, b4]
  ] satisfies [[string, string], [string, string]]
  const c = [c1, c2] satisfies [string, string]
  return {
    a,
    b,
    c,
    inputs
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body } = req
  const parsedBody = JSON.parse(body)
  console.log('🚀 ~ parsedBody', parsedBody.proof)
  //   const { a, b, c, inputs } = await exportSolidityCallDataGroth16({ proof: parsedBody.proof, publicSignals: parsedBody.publicSignals });
  const calldata = await exportSolidityCallDataGroth16({
    proof: parsedBody.proof,
    publicSignals: parsedBody.publicInputs
  })
  const data = await contract.add(
    calldata.a,
    calldata.b,
    calldata.c,
    calldata.inputs,
    { gasLimit: 2000000 }
  )
  console.log('🚀 ~ data', data)
  res.status(200).json({ hash: data.hash })
  //   res.status(200).json({ hash: '' })
}
