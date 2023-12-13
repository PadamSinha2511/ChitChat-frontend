import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { BsBox2 } from 'react-icons/bs';
import {getSender} from "../config/ChatLogic"
import GroupChatModal from './GroupChatModal';
const MyChats = ({fetchAgain}) => {
  const[loggedUser,setLoggedUser] = useState();
  const {user,setUser,selectedChat,setSelectedChat,chats,setChats} = ChatState();
  
  const toast = useToast();
  
  const handleFetchChats =async()=>{
    try{
      const token = Cookies.get('token')
    
         
    const config={
      headers:{
        'Content-type':'application/json',
        Authorization:`Bearer ${token}`
      }
    }

  const {data} = await axios.get("/api/chat",config)
  console.log(data)
  setChats(data)    

  }
    catch(error)
    {
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

  
  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userdata")))
    handleFetchChats();
  },[fetchAgain])

  return (
   <>
   <Box
   display={{base:selectedChat?'none':'flex',md:'flex'}}
   flexDir={'column'}
   alignItems={'center'}
   p={3}
   bg={'white'}
   w={{base:'100%',md:'31%'}}
   borderRadius={'lg'}
   borderWidth={"1px"}
   >
      <Box
      pb={3}
      px={3}
      fontSize={{base:'28px',md:'30px'}}
      fontFamily={'Work Sans'}
      display={'flex'}
      w={'100%'}
      justifyContent={'space-between'}
      alignItems={'center'}
      >
          My Chats
          <GroupChatModal>
            
          <Button
          display='flex'
          fontSize={{base:'17px',md:'10px',lg:'17px'}}
          rightIcon={<AddIcon/>}
          >
            New Group Chat
          </Button>
            </GroupChatModal>
      </Box>

      <Box
      display={'flex'}
      flexDir={'column'}
      p={3}
      w='100%'
      h='100%'
      borderRadius={'lg'}
      overflowY={'hidden'}
      >
        {chats?(
          <Stack overflowY={'scroll'}>
              {chats.map((chat)=>(
                <Box 
                onClick={()=>setSelectedChat(chat)}
                cursor={'pointer'}
                bg={selectedChat ===chat ?'#38B2AC':'#E8E8E8'}
                color={selectedChat===chat?'white':'black'}
                px={3}
                py={2}
                borderRadius={'lg'}
                key={chat._id}
                _hover={{
                  background:'#0C2637',
                  color:"white"
                }}
                >
                  <Text>
                    {!chat.isGroupChat?(
                      getSender(loggedUser,chat.users)

                    ):chat.chatName}
                  </Text>
                </Box>
              ))}
          </Stack>
        ):(
          <ChatLoading/>
        )}


      </Box>


    </Box>
   </>
  )
}

export default MyChats;