import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react'
import { Karla, Silkscreen } from '@next/font/google'
import { ethers } from 'ethers'
import { useContract, useSigner } from 'wagmi'
import { abi } from '../constants/abi'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ subsets: ['latin'], weight: '400' })

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
  const { data: signer } = useSigner()
  const blind = useContract({
    address: '0x13e4E0a14729d9b7017E77ebbDEad05cb8ad1540',
    abi,
    signerOrProvider: signer
  })
  const toast = useToast()
  const cutMsg = msg.substring(0, 1000) + (msg.length > 1000 ? '...' : '')

  const sig = ethers.utils.splitSignature(signature as any)
  const signingAddr = ethers.utils.verifyMessage(msg, sig)
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
        backgroundColor="#1E1E38"
        alignItems="center"
        padding="8"
        // paddingTop="8"
        // paddingBottom="8"
        gap="4"
        borderRadius="10"
        minW="800px"
        // maxW="800px"
        // maxH="190px"
        _hover={{
          cursor: 'pointer',
          backgroundColor: '#262645',
          boxShadow:
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
      >
        <Flex justifyContent="space-between" w="100%">
          <Box
            backgroundColor="#4C82FB"
            className={font.className}
            borderRadius="4"
            px="3"
            style={{ textTransform: 'capitalize' }}
          >
            {company}
          </Box>
          {/* <Text className={bodyFont.className}>
            Signature:{' '}
            {`${signature?.substring(0, 5)}...${signature?.substring(
              signature.length - 5
            )}`}
          </Text> */}
          <Button onClick={verifySig} variant="link">
            Verify
          </Button>
        </Flex>
        <Text
          alignContent="start"
          display="block"
          className={bodyFont.className}
          color="#F5F5F4"
          fontSize="16"
          overflow="hidden"
        >
          {cutMsg}
        </Text>
      </Flex>
    </>
  )
}

export default Post
