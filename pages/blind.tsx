import {
  Button,
  Container,
  Flex,
  Input,
  Text,
  Textarea
} from '@chakra-ui/react'
import { Silkscreen } from '@next/font/google'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { abi } from '../constants/abi'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })

const Blind = () => {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const { address } = useAccount()
  const formattedAddr = address ? address : '0x'
  const [enabled, setEnabled] = useState(false)
  const { data: domainStr } = useContractRead({
    address: enabled ? '0x04dc2484cc09c2E1c7496111A18b30878b7d14B2' : '0x',
    abi,
    functionName: 'get',
    args: [formattedAddr]
  })

  useEffect(() => {
    if (!enabled) setEnabled(true)
  }, [enabled])

  return (
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
        <div>
          <ConnectButton />
        </div>
        <div>
          <Text>Title</Text>
          <Input onChange={e => setTitle(e.target.value)} value={title} />
        </div>
        <div>
          <Text>Post</Text>
          <Textarea
            onChange={e => setMessage(e.target.value)}
            value={message}
          />
        </div>
        <div className={font.className}>Committed to {domainStr}</div>
        <Button>Create Post</Button>
      </Flex>
    </Container>
  )
}

export default Blind
