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
import { abi } from '../constants/abi'

const inter = Inter({ subsets: ['latin'] })

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
  const [token, setToken] = useState('')
  const { height, width } = useWindowSize()
  const [hash, setHash] = useState<`0x${string}`>()
  const toast = useToast()
  const { isSuccess: txSuccess } = useWaitForTransaction({
    // confirmations: 5,
    hash,
    enabled: !!hash
  })

  const formattedAddr = address ? address : '0x'

  const { data: domainStr } = useContractRead({
    address: '0x04dc2484cc09c2E1c7496111A18b30878b7d14B2',
    abi,
    functionName: 'get',
    args: [formattedAddr],
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

  useEffect(() => {
    if (!token && msg) {
      setToken(msg.toString())
    }
  }, [msg, token])

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
    if (res.isVerified) {
      setIsVerified(true)
    }
  }, [proof, publicInputs])

  const handleVerifyContract = useCallback(async () => {
    setIsVerifying(true)
    const res = await fetch('http://localhost:3000/api/contract', {
      method: 'POST',
      body: JSON.stringify({ proof, publicInputs })
    }).then(res => {
      setIsVerifying(false)
      return res.json()
    })
    if (res.hash) {
      setIsVerified(true)
      setHash(res.hash)
    }
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
    if (proveOutput.proof && proveOutput.publicSignals) {
      setProof(proveOutput.proof)
      setPublicSignals(proveOutput.publicSignals)
      setIsGenerated(true)
    }
  }, [address, token])

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
            <p>
              {isGenerated &&
                isVerified &&
                `Proved you belong domain: ${domainStr}`}
            </p>
          </Flex>
        </Container>
      </main>
    </>
  )
}
