import { Box, Container, Flex, Text } from '@chakra-ui/react'
import { Karla, Silkscreen } from '@next/font/google'

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
          <div>
            <Box
              backgroundColor="#4C82FB"
              className={font.className}
              borderRadius="4"
              px="3"
              style={{ textTransform: 'capitalize' }}
            >
              {company}
            </Box>
          </div>
          <>
            <Text className={bodyFont.className}>
              Signature:{' '}
              {`${signature?.substring(0, 5)}...${signature?.substring(
                signature.length - 5
              )}`}
            </Text>
          </>
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
