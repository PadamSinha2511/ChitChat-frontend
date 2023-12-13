import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import Cookies from 'js-cookie'
import axios from 'axios'
import UserListItem from './UserAvatar/UserListItem'
import UserBadgeItem from './UserAvatar/UserBadgeItem'

const GroupChatModal = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const[groupChatName,setGroupChatName] = useState()
    const[selectedUsers,setSelectedUsers] = useState([])
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast();
    const {user,chats,setChats}=ChatState()

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

    const handleSubmit =async ()=>{
        if(!groupChatName || !selectedUsers)
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
            const token = Cookies.get('token')
           
            const config = {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }


            const {data} = await axios.post("/api/chat/group",
            {
                users:JSON.stringify(selectedUsers.map(u=>u._id)),
                name:groupChatName
            }
            ,config)

            setChats([data,...chats])
            onClose();
            toast({
                title:'New Group Created',
                status:'success',
                duration:5000,
                position:'top-left',
                isClosable:true
              })
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

    const handleGroup=(user)=>{
        if(selectedUsers.includes(user))
        {
            toast({
                title:'User already added',
                status:'warning',
                position:'top',
                isClosable:'true',
                duration:5000
            })
        }

        setSelectedUsers([...selectedUsers,user])
    }


    const handleDelete = (userToDelete)=>{
        setSelectedUsers(selectedUsers.filter((sel)=>sel._id!==userToDelete._id))
    }

        return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
              fontSize={'35px'}
              fontFamily={'Work sans'}
              display={'flex'}
              justifyContent={'center'}
              >Create Group Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody 
              display={'flex'}
              flexDir={'column'}
              alignItems={'center'}
              >

                <FormControl>
                <Input
                mb={3}
                placeholder='Chat Name'
                
                onChange = {(e)=>setGroupChatName(e.target.value)}
                />
                
                </FormControl>
                <FormControl>
                <Input
                mb={1}
                placeholder='Add users...'
                onChange = {(e)=>handleSearch(e.target.value)}
                />
               
                </FormControl>
                {/* Render search users */}
                <Box 
                w={'100%'} 
                display='flex'
                flexWrap={'wrap'}
                >
                {
                    selectedUsers.map(u=>(
                        <UserBadgeItem
                        key={user._id}
                        user={u}
                        handleFunction={()=>handleDelete(u)}
                        />
                    ))
                }
                </Box>

                {/* Selected Users */}
                {loading?<div>Loading....</div>:(
                    searchResult.slice(0,4).map(user=>(
                        <UserListItem key={user._id} person={user} handleFunction={()=>handleGroup(user)}/>
                    ))
                )}
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                  Create Chat
                </Button>
               
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default GroupChatModal