import { FormControl, VStack,FormLabel,Input,Button } from '@chakra-ui/react'
import axios from 'axios'
import React, { useCallback, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import {useNavigate} from "react-router-dom"

const Login = () => {
  const[email,setEmail] = useState()
  const[password,setPassword] = useState()
  const[loading,setLoading] = useState(false)

  const toast = useToast();
  const navigate = useNavigate();
  const handleLogin = async ()=>{

    setLoading(true)
    if( !email || !password )
    {
      toast({
        title:'All fields are required',
        status:'warning',
        duration:5000,
        isClosable:true,
        position:'top'
      })
      return
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
  
  
      const {data} = await axios.post("/api/user/signin",
        {email,password},
        config
        )
        localStorage.setItem("userdata",JSON.stringify(data))
        setLoading(false)
        navigate("/chat")
    } catch (error) {
      console.log(error)
    }


   
  }
  return (
    <VStack spacing='5px'>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>

        <Input
          type={ "password"}
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button
        colorScheme="facebook"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handleLogin}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        width="100%"
       
        onClick={()=>{
          setEmail('guest@gmail.com')
          setPassword(123456)
        }}
      >
        Login as a guest
      </Button>
    </VStack>
  )
}

export default Login