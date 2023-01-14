//@ts-nocheck
import { Container, Flex } from '@chakra-ui/react'
import { Karla, Silkscreen } from '@next/font/google'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Post from '../components/Post'
import { getPosts, getPostsFilterDomain } from './firebase'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ weight: '300' })

const Display = () => {
  const [posts, setPosts] = useState([])
  console.log('🚀 ~ Display ~ posts', posts)

  const router = useRouter()

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

  return (
    <>
      <Container
        as={Flex}
        centerContent
        gap="4"
        padding="4"
        justifyContent="center"
        minH="100vh"
        margin="0"
        minW="800px"
        maxW="800px"
      >
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
