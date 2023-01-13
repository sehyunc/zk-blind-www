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
  import { useAccount, useContractRead, useConnect, useSigner, useContract } from 'wagmi'
  import { InjectedConnector } from "wagmi/connectors/injected";
  import { abi } from '../constants/abi'
  import blind from '../constants/blindAbi'
  import { getPosts } from "./firebase"
  
  const font = Silkscreen({ subsets: ['latin'], weight: '400' })
  
  const Display = () => {

    const [posts, setPosts] = useState([]);
  
    useEffect(() => {
      getPostArray()
    }, [])
  
    const { connect } = useConnect({
      connector: new InjectedConnector(),
    });
  
    const { data: signer } = useSigner();

    async function getPostArray() {
        const res = await getPosts();
        setPosts(res as any)
    }

    function getPostComponent(e:any) {

        return (
            <div>
                <Text>Title</Text>
                <Text>e.title</Text>
                <Text>Message</Text>
                <Text>e.msg</Text>
                <Text>Signature</Text>
                <Text>e.signature</Text>
            </div>
            )

    }
  
  
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
          
          {
            posts.map(getPostComponent)
          }
        </Flex>
      </Container>
    )
  }
  
  export default Create
  