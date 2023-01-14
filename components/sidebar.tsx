import { Box, Button, Container, Flex, useDisclosure } from '@chakra-ui/react'
import { Silkscreen } from '@next/font/google'
import { useState, useEffect } from 'react'
import { getPosts } from '../pages/firebase'
import Create from '../pages/create'
import { useRouter } from 'next/router'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
export const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [domains, setDomains] = useState([])

  const router = useRouter()

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await getPosts()

      console.log(res)

      const allDomains = res.map((post: any) => {
        return post.company
      })

      console.log(allDomains)

      const uniqueDomains = allDomains.filter(
        (e: string, i: any) =>
          allDomains.findIndex((obj: any) => obj === e) === i
      )

      console.log(uniqueDomains)
      setDomains(uniqueDomains as [])
    }
    fetchPosts()
  }, [])

  return (
    <Flex padding="4">
      <Create isOpen={isOpen} onClose={onClose} />
      <Container
        as={Flex}
        centerContent
        maxH="400"
        bg="#1E1E38"
        borderRadius="10"
        w="200px"
        p={4}
        gap="4"
        color="white"
        className={font.className}
      >
        <Button backgroundColor="#4C82FB" w="100%" onClick={() => router.push('/posts')}>
          Home
        </Button>
        <Button backgroundColor="#4C82FB" w="100%" onClick={() => onOpen()}>
          New Post
        </Button>
        Domains
        {domains.map((e, i) => {
          return (
            <Button
              key={i}
              onClick={() =>
                router.push({
                  pathname: '/posts',
                  query: { domain: e }
                })
              }
              variant="link"
            >
              {e}
            </Button>
          )
        })}
      </Container>
    </Flex>
  )
}
