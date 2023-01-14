//@ts-nocheck
import { Button, Container, Flex, Text, useDisclosure, Box, useToast } from '@chakra-ui/react'
import { Silkscreen } from '@next/font/google'
import { useEffect, useState } from 'react'
import { getPosts, getPostsFilterDomain } from './firebase'
import { Karla } from '@next/font/google'
import { useRouter } from "next/router"
import {ethers} from 'ethers'
import { useContract, useSigner } from 'wagmi'
import { abi } from '../constants/abi'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({weight: '300'})
const Display = () => {

  const toast = useToast()

  const [posts, setPosts] = useState([])
  console.log('🚀 ~ Display ~ posts', posts)

  const { data: signer } = useSigner()

  const blind = useContract({
    address: '0x13e4E0a14729d9b7017E77ebbDEad05cb8ad1540',
    abi,
    signerOrProvider: signer
  })

  const router = useRouter();

  useEffect(() => {

    const fetchPosts = async () => {
      console.log(router.query.domain)
      if (router.query.domain != undefined) {
        const res = await getPostsFilterDomain(router.query.domain)
        setPosts(res as any)
      } else {
        const res = await getPosts()
        setPosts(res as any)
      }
    }
    fetchPosts()
  }, [router.query.domain])


  const Domain =({domain}: {domain:string}) => {
    return (
      <Container 
      backgroundColor='#4C82FB'
      w='fit-content'
      borderRadius='4'
      alignItems='start'
      >
          <span
      className={font.className}
      style={{ textTransform: 'capitalize' }}
    >
    {domain}
    </span>
      </Container>
    )
  }

  const PostPreview = ({
    title,
    msg,
    signature,
    company
  }: {
    title: string
    msg: string
    signature: string
    company: string
  }) => {

    async function verifySig() {

        const sig = ethers.utils.splitSignature(signature as any);
        console.log(sig)
        const signingAddr = ethers.utils.verifyMessage(msg, sig)
        const domain = await blind.get(signingAddr)
        if (domain) {
            console.log("verified")
            toast({
                title: 'Message verified.',
                description: "We've verified the sender's signature for you",
                status: 'success',
                duration: 9000,
                isClosable: true,
              })
        } else {
            console.log("not verified")
            toast({
                title: 'Message not verified.',
                description: "This signer is not a valid poster.",
                status: 'error',
                duration: 9000,
                isClosable: true,
              })
        }
        // verify that the signingaddr is the same as the addr we want 
    }
    return (
      <>
        <Flex
          direction="column"
          alignItems="center"
          backgroundColor="#1E1E38"
          padding="12"
          paddingTop="8"
          paddingBottom='8'
          gap="4"
          borderRadius="10"
          minW="800px"
          maxW="800px"
          maxH='190px'
          _hover={{
            cursor: 'pointer',
            backgroundColor: '#262645',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
          }}
        >
          <Flex direction='row' 
          justifyContent='space-between'
          w='100%'>
            <div display='flex'>
              <Domain domain={company}></Domain>
            </div>
            <>
            <Box>
            <Text className={bodyFont.className}>
              Signature:{' '}
              {`${signature?.substring(0, 5)}...${signature?.substring(
                signature.length - 5
              )}`}
            </Text>
            <Button variant="link" onClick={verifySig}>
                Verify
            </Button>
            </Box>
            </>
          </Flex>

          <Text alignContent='start' display='block' className={bodyFont.className} color='#F5F5F4' fontSize='15'
          overflow='hidden'>
            {msg}
          </Text>
        </Flex>
      </>
    )
  }

  return (
    <>
      <Container
        as={Flex}
        centerContent
        gap="4"
        padding='4'
        justifyContent="center"
        minH="100vh"
        margin='0'
        minW="800px"
        maxW="800px"
      >
        {posts.map(p => (
          <PostPreview
            key={p.id}
            title={p.title}
            msg={p.msg}
            signature={p.signature}
            company={p.company}
          />
        ))}
      </Container>
    </>
  )
}

export default Display
