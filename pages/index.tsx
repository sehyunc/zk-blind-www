import {
  Button,
  Container,
  Flex,
  Text,
  Textarea,
  useToast
} from '@chakra-ui/react'
import { Inter } from '@next/font/google'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'usehooks-ts'
import { useAccount, useContractRead, useWaitForTransaction } from 'wagmi'

const inter = Inter({ subsets: ['latin'] })

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

export default function Home() {
  const { address } = useAccount()
  const router = useRouter()
  const [domain, setDomain] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [proof, setProof] = useState('')
  const [publicInputs, setPublicSignals] = useState<string[]>([])
  console.log('🚀 ~ Home ~ publicInputs', publicInputs.length)
  const [token, setToken] = useState('')
  const { height, width } = useWindowSize()
  const [hash, setHash] = useState<`0x${string}`>(
    '0xf1ee3bd8e7bb42ead82ab53aa2d51c5f3a498ec019177163b9d11342e40d41c7'
  )
  const toast = useToast()
  const { isSuccess: txSuccess } = useWaitForTransaction({
    // confirmations: 5,
    hash,
    enabled: !!hash
  })

  const formatProof = useCallback(() => {
    const p = JSON.parse(proof)
    console.log('🚀 ~ formatProof ~ p', p)
    const formattedProof = {
      //   a: [p.pi_a[0].toString(16), p.pi_a[1].toString(16)],
      //   b: [
      //     [p.pi_b[0][1].toString(16), p.pi_b[0][0].toString(16)],
      //     [p.pi_b[1][1].toString(16), p.pi_b[1][0].toString(16)]
      //   ],
      //   c: [p.pi_c[0].toString(16), p.pi_c[1].toString(16)],
      a: p.pi_a
    }
    console.log('🚀 ~ formatProof ~ formattedProof', formattedProof)
    return formattedProof
  }, [proof])

  const { data: domainStr } = useContractRead({
    address: '0x04dc2484cc09c2E1c7496111A18b30878b7d14B2',
    abi,
    functionName: 'get',
    args: ['0x0000000000000000000000000000000000000000'],
    enabled: txSuccess,
    onSuccess: data => {
      if (data) {
        setDomain(`${data}`)
      }
    }
  })

  const msg = router.query.msg

  useEffect(() => {
    if (txSuccess) {
    }
  }, [txSuccess])

  //   useEffect(() => {
  //     if (publicInputs) {
  //       setDomain(
  //         String.fromCharCode(
  //           ...publicInputs.slice(18, 26).map((x: any) => parseInt(x, 10))
  //         )
  //       )
  //     }
  //   }, [publicInputs])

  useEffect(() => {
    if (!token && msg) {
      setToken(msg.toString())
    }
  }, [msg, token])

  const handleVerifyContract = useCallback(async () => {
    // const hexPublicInputs = publicInputs.map(
    //   x => `0x${BigInt(x).toString(16).padStart(64, '0')}`
    // )
    const res = await fetch('http://localhost:3000/api/contract', {
      method: 'POST',
      body: JSON.stringify({ proof, publicInputs })
    }).then(res => {
      console.log('🚀 ~ handleVerifyContract ~ res', res)
      return res.json()
    })
    console.log('🚀 ~ res ~ res', res.hash)
    setHash(res.hash)
  }, [proof, publicInputs])

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    const proveOutput = await fetch('http://localhost:3000/api/prove', {
      method: 'POST',
      body: JSON.stringify({
        token,
        address
      })
    }).then(res => {
      setIsGenerating(false)
      return res.json()
    })
    // console.log('🚀 ~ handleGenerate ~ proveOutput', proveOutput)
    if (proveOutput.proof && proveOutput.publicSignals) {
      setProof(proveOutput.proof)
      setPublicSignals(proveOutput.publicSignals)
      setIsGenerated(true)
    }
  }, [address, token])

  const handleVerify = useCallback(async () => {
    setIsVerifying(true)
    const res = await fetch('http://localhost:3000/api/verify', {
      method: 'POST',
      body: JSON.stringify({
        proof,
        publicInputs
      })
    }).then(res => {
      setIsVerifying(false)
      return res.json()
    })
    console.log('🚀 ~ handleVerify ~ res', res)
    if (res.isVerified) {
      setIsVerified(true)
    }
  }, [proof, publicInputs])

  return (
    <>
      <Head>
        <title>zk blind</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {isVerified && <Confetti width={width} height={height} />}
        <Container
          as={Flex}
          centerContent
          gap="6"
          justifyContent="center"
          minH="100vh"
        >
          <Flex
            direction="column"
            alignItems="center"
            backgroundColor="#241520"
            padding="8"
            gap="4"
            borderRadius="10"
          >
            <button onClick={formatProof}>get proof</button>
            <ConnectButton />
            <Textarea
              value={token}
              onChange={e => setToken(e.target.value)}
              size="lg"
              placeholder="Paste your JWT here"
              _placeholder={{ color: '#992870' }}
            />
            <Button
              backgroundColor="#992870"
              onClick={handleGenerate}
              variant="solid"
              isLoading={isGenerating}
              loadingText="Generating"
              isDisabled={isGenerated}
            >
              {isGenerated ? 'Generated' : 'Generate Proof and Inputs'}
            </Button>
            {domain && <Text>Proved you belong to {domain}!</Text>}
            <Textarea
              value={!!proof ? JSON.stringify(proof) : ''}
              size="lg"
              placeholder="Waiting for proof generation"
              _placeholder={{ color: '#992870' }}
            />
            <Textarea
              value={publicInputs.toString()}
              size="lg"
              placeholder="Waiting for public input generation"
              _placeholder={{ color: '#992870' }}
            />
            <Button
              backgroundColor="#992870"
              //   onClick={handleVerify}
              onClick={handleVerifyContract}
              variant="solid"
              isLoading={isVerifying}
              loadingText="Verifying"
              //   isDisabled={!isGenerated || isVerified}
            >
              Verify
            </Button>
            <p>{isGenerated && isVerified && 'Proof and Inputs Valid!'}</p>
          </Flex>
        </Container>
      </main>
    </>
  )
}

// const { data, isError, isLoading } = useContractRead({
//   address: "0x7a0fFBF0bd9032Baa4ecF06541BfE422B9f62978",
//   abi: VerifierAbi,
//   functionName: "verifyProof",
//   args: [
//     [
//       "0x05c6b8c5586d473ac18f166c7293f179ae321aa66eb7781a566e18b18cfa201c",
//       "0x16110cdea1999b371f1039b80c02c46bd0497ae24370ea1ca589f4957bf6bcfb",
//     ],
//     [
//       [
//         "0x11e07b2879b5d400ef3e59b6298470064446162010cb949e58a734c0ac731474",
//         "0x1b4b93e61b502d005f4ddcf5fecd48c0c362acac0c055cc8e0c15a2070ce0d69",
//       ],
//       [
//         "0x2e7b01faa29c857f5074afcecaca244a0a298c2bd21bbe78a1dc8e571c2317fa",
//         "0x02f3c03c5f3b778c1e5364ccfada6a8216eb7f477c698d33106571727e4845ad",
//       ],
//     ],
//     [
//       "0x1eb2b326c3e0a3294718954d4a766000caba888e406e10a988ed568c81131aed",
//       "0x2f67225076ddf6c1f269bbca617d635eec458b44b0eae9fdb070d1b228d13a29",
//     ],
//     ["0x2323966c7385a437ec039864aa44a153587a402717f8bfe53741eb490f9935c8"],
//   ],
//   enabled,
// });
// console.log("🚀 ~ Home ~ isLoading", isLoading);
// console.log("🚀 ~ Home ~ isError", isError);
// console.log("🚀 ~ Home ~ data", data);
