import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import {
	darkTheme,
	getDefaultWallets,
	RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import { configureChains, createClient, goerli, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import '../styles/globals.css'

const { chains, provider } = configureChains([goerli], [publicProvider()])

const { connectors } = getDefaultWallets({
	appName: 'zk blind',
	chains
})

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider
})

const theme = extendTheme({
	styles: {
		global: () => ({
			body: {
				bg: '#000'
			}
		})
	}
})

export default function App({ Component, pageProps }: AppProps) {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider chains={chains} theme={darkTheme()}>
				<ChakraProvider theme={theme}>
					<Component {...pageProps} />
				</ChakraProvider>
			</RainbowKitProvider>
		</WagmiConfig>
	)
}
