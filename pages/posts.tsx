//@ts-nocheck
import { Button, Container, Flex, Text, useDisclosure } from '@chakra-ui/react'
import { Silkscreen } from '@next/font/google'
import { useEffect, useState } from 'react'
import Create from './create'
import { getPosts } from './firebase'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })

const Display = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [posts, setPosts] = useState([])
  console.log('🚀 ~ Display ~ posts', posts)

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await getPosts()
      setPosts(res as any)
    }
    fetchPosts()
  }, [])

  const Post = ({
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
          backgroundColor="#241520"
          padding="8"
          gap="4"
          borderRadius="10"
          minW="600px"
          maxW="600px"
        >
          <Text className={font.className} style={{ fontSize: '20px' }}>
            {title}
          </Text>
          <Text>
            Signature:{' '}
            {`${signature?.substring(0, 5)}...${signature?.substring(
              signature.length - 5
            )}`}
          </Text>
          <Text>{msg}</Text>
          {/* <Text>{signature}</Text> */}
          <Text>
            Posted by:{' '}
            <span
              className={font.className}
              style={{ textTransform: 'capitalize' }}
            >
              {company}
            </span>
          </Text>
        </Flex>
      </>
    )
  }

  return (
    <>
      <Create isOpen={isOpen} onClose={onClose} />
      <Container
        as={Flex}
        centerContent
        gap="6"
        justifyContent="center"
        minH="100vh"
      >
        <div style={{ position: 'absolute', right: 0, top: 0 }}>
          <Button onClick={() => onOpen()}>New Post</Button>
        </div>
        {posts.map(p => (
          <Post
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
