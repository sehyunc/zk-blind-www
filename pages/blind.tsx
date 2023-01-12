import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useContractRead, useWaitForTransaction } from 'wagmi'
import { abi } from '../constants/abi'
import { useState } from 'react'

type Props = {}

const Blind = (props: Props) => {
  const { address } = useAccount()
  const formattedAddr = address ? address : '0x'
  const [enabled, setEnabled] = useState(false)
  const { data: domainStr } = useContractRead({
    address: '0x04dc2484cc09c2E1c7496111A18b30878b7d14B2',
    abi,
    functionName: 'get',
    args: [formattedAddr],
    enabled
  })
  console.log('🚀 ~ Blind ~ domainStr', domainStr)
  return (
    <div>
      <ConnectButton />
      <p>{domainStr}</p>
    </div>
  )
}

export default Blind
