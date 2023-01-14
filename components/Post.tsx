import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react'
import { Karla, Silkscreen } from '@next/font/google'
import { ethers } from 'ethers'
import { useContract, useSigner } from 'wagmi'
import { abi } from '../constants/abi'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ weight: '300' })

const Post = ({
  msg,
  signature,
  company
}: {
  title: string
  msg: string
  signature: string
  company: string
}) => {
  const toast = useToast()
  const { data: signer } = useSigner()
  const sig = ethers.utils.splitSignature(signature as any)
  const signingAddr = ethers.utils.verifyMessage(msg, sig)
  const blind = useContract({
    address: '0x13e4E0a14729d9b7017E77ebbDEad05cb8ad1540',
    abi,
    signerOrProvider: signer
  })
  async function verifySig() {
    if (!blind || !signingAddr) return
    const domain = await blind.get(signingAddr as `0x${string}`)
    if (domain) {
      console.log('verified')
      toast({
        title: 'Message verified.',
        description: "We've verified the sender's signature for you",
        status: 'success',
        duration: 9000,
        isClosable: true
      })
    } else {
      console.log('not verified')
      toast({
        title: 'Message not verified.',
        description: 'This signer is not a valid poster.',
        status: 'error',
        duration: 9000,
        isClosable: true
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
        paddingBottom="8"
        gap="4"
        borderRadius="10"
        minW="800px"
        maxW="800px"
        maxH="190px"
        _hover={{
          cursor: 'pointer',
          backgroundColor: '#262645',
          boxShadow:
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
      >
        <Flex direction="row" justifyContent="space-between" w="100%">
          <Box
            backgroundColor="#4C82FB"
            className={font.className}
            borderRadius="4"
            px="3"
            style={{ textTransform: 'capitalize' }}
          >
            {company}
          </Box>
          <Text className={bodyFont.className}>
            Signature:{' '}
            {`${signature?.substring(0, 5)}...${signature?.substring(
              signature.length - 5
            )}`}
          </Text>
          <Button onClick={verifySig} variant="link">
            Verify
          </Button>
        </Flex>
        <Text
          alignContent="start"
          display="block"
          className={bodyFont.className}
          color="#F5F5F4"
          fontSize="15"
          overflow="hidden"
        >
          {msg}
        </Text>
      </Flex>
    </>
  )
}

export default Post
