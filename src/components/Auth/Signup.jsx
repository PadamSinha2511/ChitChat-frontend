  import { FormControl, FormLabel, VStack ,Input,InputGroup,InputRightElement,Button} from '@chakra-ui/react'
import React, { useState,useCallback } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from "axios"
import { useNavigate } from "react-router-dom";
 const Signup = () => {

    const[name,setName] = useState()
    const[email,setEmail] = useState()
    const[password,setPassword] = useState()
    const[correctPassword,setCorrectPassword] = useState()
    const[pic,setPic] = useState()
    const[show,setShow] = useState(false)
    const[loading,setLoading] = useState(false)

    const toast = useToast();
    const navigate = useNavigate()



    const handleShow = useCallback((e)=>{
      e.preventDefault();
      setShow((beforeValue)=>!beforeValue)
    },[])


    const postDetails = (pics)=>{
      setLoading(true)
      if(pics ===undefined)
      {
        toast({
          title:'Please select an image',
          status:'warning',
          duration:5000,
          isClosable:true,
          position:'top'
        })
        return 
      }

      if(pics.type === 'image/jpeg' || pics.type ==='image/png')
      {
        const imageData  = new FormData();
        imageData.append('file',pics)
        imageData.append('upload_preset','chitchat')
       
        fetch('https://api.cloudinary.com/v1_1/dwzlhfsyn/upload',{
          method:"post",
          body:imageData
        }).then(res=>res.json())
        .then(data=>{
          setPic(data.url.toString())
          console.log(data.url.toString())
          setLoading(false)
        })
      }
      else{
        toast({
          title:'Please select an image',
          status:'warning',
          duration:5000,
          isClosable:true,
          position:'top'
        })
        setLoading(false)
        return 
      }

    }

    const handleSubmit = async()=>{
      
      setLoading(true)
      if(!name || !email || !password || !correctPassword)
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

      if(password !== correctPassword)
      {
        toast({
          title:'Password does not match ',
          status:'error',
          duration:5000,
          isClosable:true,
          position:'top'
        })
        return
      }

      try {
        const {data} = await axios.post("/api/user/signup",
     {
      name:name,
      email:email,
      password:password,
      pic:pic
     },
     {
      headers:{
        'Content-Type':'application/json'
      }
     })

     toast({
      title:'Registration successfull',
      status:'success',
      duration:5000,
      isClosable:true,
      position:'top'
     })

     
     setLoading(false)
     navigate("/")
      } catch (error) {
        
      }


     
     
    }
  return (
    <VStack  spacing='5px' >
        <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
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
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleShow}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setCorrectPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleShow}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e)=>postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="facebook"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  )
}
export default Signup