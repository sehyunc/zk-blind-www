import { Box, ChakraProvider, Container, extendTheme, Flex } from '@chakra-ui/react'
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
import { Footer } from './components/footer'
import { Sidebar } from './components/sidebar'

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
        bg: '#131322'
      }
    })
  }
})

export default function App({ Component, pageProps }: AppProps) {
  const isLoggedIn = false
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <ChakraProvider theme={theme}>
          <Flex
          justifyContent='center'
            flexDirection='row'
            margin='0 auto'
            gap='4'
            >
            {isLoggedIn && <Sidebar />}
            <Component {...pageProps} />
          </Flex>
        </ChakraProvider>
      </RainbowKitProvider>
      <Footer />
    </WagmiConfig>
  )
}
