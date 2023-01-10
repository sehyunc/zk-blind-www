import { Inter } from '@next/font/google'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import { useState } from 'react'
import { useContractRead } from 'wagmi'
import VerifierAbi from '../constants/abi/verifier.abi.json'
// import { generateProof } from "../helpers/zkp";
import { Button, Container, Flex, Input, Textarea } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	const [enabled, setEnabled] = useState(false)
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
	const [token, setToken] = useState('')
	console.log('🚀 ~ Home ~ token', token)
	return (
		<>
			<Head>
				<title>zk blind</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
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
						<Button backgroundColor="#992870" variant="solid">
							Verify
						</Button>
					</Flex>
				</Container>
			</main>
		</>
	)
}
