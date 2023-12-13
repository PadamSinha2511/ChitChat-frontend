import { Box, Container, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../components/Auth/Login'
import  Signup  from '../components/Auth/Signup'
import { useFormAction, useNavigate } from 'react-router-dom'
const HomePage = () => {

    const navigate = useNavigate();

    useEffect(()=>{
        const userData = JSON.parse(localStorage.getItem("userdata"))
        console.log(userData)
        if(userData)
        {
            navigate("/chat")
        }
       
    },[navigate])

    return (
        <Container maxW='xl' centerContent>
            <Box
                d='flex'

                justifyContent='center'
                p={3}
                bg={'white'}
                w='100%'
                m='40px 0 15px 0'
                borderRadius='lg'
                borderWidth='1px'
            >
                <Text fontSize='3xl' textAlign='center' fontFamily='Work Sans'>ChitChat</Text>
            </Box>
            <Box bg='white' w='100%' p={4} textColor='black' borderRadius='lg' borderWidth='1px'>
                <Tabs variant='soft-rounded' colorScheme='facebook'>
                    <TabList>
                        <Tab w="50%">Login</Tab>
                        <Tab w="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                           <Login/>
                        </TabPanel>
                        <TabPanel>
                            <Signup/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage