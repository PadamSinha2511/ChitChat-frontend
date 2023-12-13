import { Avatar, Box, Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useDisclosure,Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useToast,
  Spinner, } from '@chakra-ui/react';
import React, { useRef, useState } from 'react'
import {BsSearch} from "react-icons/bs"
import {BellIcon,ChevronDownIcon} from "@chakra-ui/icons"

import { ChatState } from '../context/ChatProvider';
import ProfileModel from './ProfileModel';
import ProfileModal from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'
import ChatLoading from './ChatLoading';
import UserListItem from './UserAvatar/UserListItem';
const SideDrawer = () => {


  const { isOpen, onOpen, onClose } = useDisclosure()
 
  const[search,setSearch] = useState("")
  const[searchResult,setSearchResult] = useState([])
  const[loading,setLoading]=useState(false);
  const[loadingChat,setLoadingChat]=useState();

  const {user,setSelectedChat,chats,setChats}=ChatState();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = ()=>{
    localStorage.removeItem("userdata")
    Cookies.remove('token')
    navigate("/")
  }


  const handleSearch = async()=>{

    if(!search)
    {
      toast({
        title:'Please enter something in search',
        status:'warning',
        duration:5000,
        position:'top-left',
        isClosable:true,

      })
      return
    }
 
    try {
      setLoading(true)
      const token = Cookies.get('token')
     
    const config={
      headers:{
        'Content-type':'application/json',
       
        
      }
    }

    const {data} = await axios.get(`/api/user/allusers?search=${search}`,config)
    console.log(data)


    setLoading(false)
    setSearchResult(data)

    } catch (error) {
      toast({
        title:'Something went wrong',
        status:'error',
        duration:5000,
        position:'top-left',
        isClosable:true
      })
      return
    }
   


    
    
  }

  const accessChat=async (userId)=>{
    try {
      setLoadingChat(true)
      const token = Cookies.get('token')
      console.log(token)
      const config={
        headers:{
          'Content-type':'application/json',
          Authorization:`Bearer ${token}`
        },
      }

      const {data} = await axios.post(`/api/chat`,{userId},config)

      if(!chats.find(chat=>chat._id ===data._id))
      setChats([data,...chats])

      setSelectedChat(data)
      setLoading(false)
      onClose();
    } catch (error) {
      toast({
        title:'Please enter something in search',
        status:'warning',
        duration:5000,
        position:'top-left',
        isClosable:true,

      })
      return
    }
  }

  return (
    <Box
    display='flex'
    justifyContent='space-between'
    bg='white'
    w='100%'
    p='5px 10px 5px 10px'
    borderWidth='5px'
    >
      <Tooltip label="Search Users to Chat" hasArrow placement='bottom-end'>
        <Button variant="ghost" onClick={onOpen}>
          <BsSearch/>
          <Text display={{base:"none",md:'flex'}} px={4}>Search User</Text>
        </Button>
      </Tooltip>
      <Text fontSize='2xl' fontFamily='Work Sans'>ChitChat</Text>
      <div>
      <Menu>
        <MenuButton p={1}>
          <BellIcon fontSize={'2xl'} m={1}/>
        </MenuButton>
      </Menu>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
          <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic}/>
        </MenuButton>
        <MenuList>
          <ProfileModal user={user}>

          <MenuItem>My Profile</MenuItem>
          </ProfileModal>
          <MenuDivider/>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>
      </div>

      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display={'flex'}  pb={2}>

            <Input placeholder='Type here...' value={search} onChange={(e)=>setSearch(e.target.value)}/>
            <Button onClick={handleSearch}>
              Go
            </Button>
            </Box>
            {loading?(
              <ChatLoading/>
            ):(
              searchResult?.map(person=>(
                <UserListItem
                key={person._id}
                person={person}
                handleFunction ={()=>accessChat(person._id)}
                />
              ))
            )}
          {loadingChat && <Spinner ml={'auto'} display={'flex'}/>}

          </DrawerBody>

         
        </DrawerContent>
      </Drawer>





    </Box>
  )
}

export default SideDrawer