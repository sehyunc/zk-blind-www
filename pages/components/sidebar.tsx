import { Box, Button, Container, Flex, useDisclosure } from "@chakra-ui/react"
import { Silkscreen } from '@next/font/google'
import Create from "../create"

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
export const Sidebar= () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Flex padding='4'>
        <Create isOpen={isOpen} onClose={onClose} />
        <Container
        as={Flex}
        centerContent
        maxH='400'
        bg='#1E1E38' 
        borderRadius='10'
        w='200px' 
        p={4} 
        gap='4'
        color='white'
        className={font.className}
        >
        <Button 
          backgroundColor='#4C82FB' 
          w='100%'
          onClick={() => onOpen()}>New Post</Button>
            Domains
        </Container>
        </Flex>
    )
}
