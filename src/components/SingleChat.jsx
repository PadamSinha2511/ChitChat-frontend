import React, { useEffect } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon, ViewIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogic';
import ProfileModal from './ProfileModel';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import "./styles/style.css"
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client"

const ENDPOINT = "http://localhost:8000";
var socket,selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => {
  
  const [messages,setMessages] = useState([])  
  const [loading,setLoading] = useState(false)  
  const [newMessage,setNewMessage] = useState('')  
  const {user,selectedChat,setSelectedChat} = ChatState();
  const [socketConnected, setSocketConnected] = useState(false)
    const toast = useToast();


   

    const handleFetchMessages = async()=>{
        if(!selectedChat) return

        try {

            const config = {
                headers:{
                    
                    Authorization:`Bearer ${Cookies.get('token')}`
                }
            }
            setLoading(true)
            const {data} = await axios.get(`/api/message/${selectedChat._id}`,config)
            

            setMessages(data)
            setLoading(false)
            socket.emit('join chat',selectedChat._id)

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }
    }

    


   
  

    const handleSendMessage = async(event)=>{
        if(event.key === 'Enter' && newMessage)
        {
                       try {
                const config = {
                    headers:{
                        'Content-Type':'application/json',
                        Authorization:`Bearer ${Cookies.get('token')}`
                    }
                }
                
                setNewMessage("")
                const {data} = await axios.post('/api/message',{
                    content:newMessage,
                    chatId:selectedChat
                },config)

            
                socket.emit("new message",data)
                setMessages([...messages,data])
                
            } catch (error) {
                console.log(error)
                toast({
                    title:'Error occured',
                    description:'Failed to send message',
                    status:'error',
                    duration:500,
                    isClosable:true,
                    position:'top'
                    
                })
            }
        }

    }

    useEffect(()=>{
        socket = io(ENDPOINT)
        socket.emit("setup",user)
        socket.on("connected",()=>{
            setSocketConnected(true)
        })

        return () => {
            socket.disconnect(user);
          };
    },[])

    useEffect(()=>{
        handleFetchMessages()
        selectedChatCompare  = selectedChat
    },[selectedChat])


    useEffect(()=>{
        console.log("I am running")
        socket.on('message recieved',(newMessageRecieved)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id)
            {
                // Give notification   
                return;
            }
            else{            
                // setMessages((prevMessages) => [...prevMessages, newMessageRecieved])
                setMessages([...messages,newMessageRecieved])
            } 

           
        })
    },[messages])

    
    const handleTyping = (e)=>{
        setNewMessage(e.target.value)
        
    }


    return (
    <>
    {selectedChat?(
        <>
        <Text
        fontSize={{base:'28px', md:'30px'}}
        pb={3}
        px={2}
        w={'100%'}
        fontFamily={'Work sans'}
        display={'flex'}
        justifyContent={{base:'space-between'}}
        alignItems={'center'}
        >
            <IconButton
            display={{base:'flex',md:'none'}}
            icon={<ArrowBackIcon/>}
            onClick={()=>setSelectedChat('')}
            />
            {messages && (!selectedChat.isGroupChat?(
                <>
                {getSender(user,selectedChat.users)}
                <ProfileModal
                user={getSenderFull(user,selectedChat.users)}
                >
                    
                </ProfileModal>
                </>
            ):(
                <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                handleFetchMessages={handleFetchMessages}
                />
                </>
            ))}

        </Text>
        <Box
        display={'flex'}
        flexDir={'column'}
        justifyContent={'flex-end'}
        p={3}
        bg={'#E8E8E8'}
        w={'100%'}
        h={'100%'}
        borderRadius={'lg'}
        overflowY={'hidden'}
        >
            {loading ?(
                <Spinner
                size='lg'
                w={20}
                h={20}
                alignSelf={'center'}
                margin={'auto'}
                />
            ):(
                <div className='messages'>
                    <ScrollableChat messages={messages}/>
                </div>
            )}
            <FormControl onKeyDown={handleSendMessage} isRequired mt={3}>

            <Input variant={'filled'}  bg={'#E8E8E8'} placeholder='Enter a message...' onChange={handleTyping} value={newMessage}/>
            </FormControl>
        </Box>
        </>
    ):(
        <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        h={'100%'}
        >
            <Text fontSize={'3xl'} pb={3} fontFamily={'Work sans'}>
                Click on a user to start Chatting
            </Text>
        </Box>
    )}
    </>
  )
}

export default SingleChat