import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import UserBadgeItem from './UserAvatar/UserBadgeItem'
import Cookies from 'js-cookie'
import axios from 'axios'
import UserListItem from './UserAvatar/UserListItem'

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,handleFetchMessages}) => {
const {selectedChat,setSelectedChat,user} = ChatState();

const[groupChatName,setGroupChatName] = useState()
const[search,setSearch] = useState()
const[searchResult,setSearchResult] = useState();
const[loading,setLoading] = useState();
const[renameLoading,setRenameLoading] = useState();

    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
  
    const handleAddUser = (newUser)=>{
        if(selectedChat.users.find((u)=>u._id === newUser._id))
        {
            toast({
                title:'User already present',
                status:'warning',
                duration:5000,
                isClosable:true,
                position:'top'
            })
            return
        }

        if(selectedChat.groupAdmin._id !== user._id)
        {
            toast({
                title:'Only admins can add or remove from group',
                status:'error',
                duration:5000,
                isClosable:true,
                position:'top'

            })
            return
        }

        try {
            setLoading(true)
            const config = {
                headers:{
                    Authorization:`Bearer ${Cookies.get('token')}`
                }
            }
            
            const {data} = axios.put("/api/chat/groupadd",{
                chatId:selectedChat._id,
                userId:newUser._id
            },config)
       
            
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)

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

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
              title: "Only admins can remove someone!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }
      
          try {
            setLoading(true);
            
            const config = {
              headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
              },
            };
            
                const { data } = await axios.put(
                    `/api/chat/groupremove`,
                    {
                      chatId: selectedChat._id,
                      userId: user1._id,
                    },
                    config
                  );

                  
                  user1._id===user._id?selectedChat(): setSelectedChat(data);
                
          
            
            setFetchAgain(!fetchAgain);
            
            setLoading(false);
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: error.response.data.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
          }
          setGroupChatName("");
    };

    const handleRename = async()=>{
        if(!groupChatName) return

        try {
            setRenameLoading(true)
            const config = {
                headers:{
                    Authorization:`Bearer ${Cookies.get('token')}`
                }
            }

            const {data} = await axios.put('/api/chat/grouprename',{
                chatId:selectedChat._id,
                chatName:groupChatName
            },config)
            console.log(data)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)

        } catch (error) {
            toast({
                title:'Error Occured!',
                description:error.response.data.message,
                status:'error',
                duration:5000,
                isClosable:true,
                position:'bottom'
            })
            setRenameLoading(false)
            setGroupChatName("")
        }

    }
    const handleSearch =async (query)=>{
        setSearch(query)
        if(!query)
        {
            return;
        }

        try {
            setLoading(true)
            const config = {
                headers:{
                    Authorization:`Bearer ${Cookies.get('token')}`
                }
            }

            const {data} = await axios.get(`/api/user/allusers?search=${search}`,config)
            
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
    return (
        <>
          <IconButton display={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen}/>
    
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
              fontSize={'35px'}
              fontFamily={'Work sans'}
              display={'flex'}
              justifyContent={'center'}
              >{selectedChat.chatName}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box
                w={'100%'}
                display={'flex'}
                flexWrap={'wrap'}
                pb={3}
                >
                    {selectedChat.users.map(u=>(
                        <UserBadgeItem
                        key={user._id}
                        user={u}
                        handleFunction={()=>handleRemove(u)}
                        />
                    ))}
                </Box>
                <FormControl display={'flex'}>
                    <Input
                    placeholder='Chat Name'
                    mb={3}
                    value={groupChatName}
                    onChange={(e)=>setGroupChatName(e.target.value)}
                    />
                    <Button
                    variant={'solid'}
                    colorScheme='teal'
                    ml={1}
                    isLoading={renameLoading}
                    onClick={handleRename}
                    >
                        Update
                    </Button>
                </FormControl>
                <FormControl>
                    <Input
                    placeholder='Add user to group'
                    mb={1}
                    onChange={(e)=>handleSearch(e.target.value)}
                    />
                </FormControl>
                {loading?(
                    <Spinner size={'lg'}/>
                ):(
                    searchResult?.map((user)=>(
                        <UserListItem
                        key={user._id}
                        person={user}
                        handleFunction={()=>handleAddUser(user)}
                        />
                    ))
                )}
              </ModalBody>
    
              <ModalFooter>
                <Button  onClick={()=>handleRemove(user)} colorScheme='red'>
                  Leave Group
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default UpdateGroupChatModal