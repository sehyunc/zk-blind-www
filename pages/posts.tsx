//@ts-nocheck
import { Button, Container, Flex, Text, useDisclosure } from '@chakra-ui/react'
import { Silkscreen } from '@next/font/google'
import { useEffect, useState } from 'react'
import { getPosts } from './firebase'
import { Karla } from '@next/font/google'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({weight: '300'})

const Display = () => {

  const [posts, setPosts] = useState([])
  console.log('🚀 ~ Display ~ posts', posts)

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await getPosts()
      setPosts(res as any)
    }
    fetchPosts()
  }, [])

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
            <Text className={bodyFont.className}>
              Signature:{' '}
              {`${signature?.substring(0, 5)}...${signature?.substring(
                signature.length - 5
              )}`}
            </Text>
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
