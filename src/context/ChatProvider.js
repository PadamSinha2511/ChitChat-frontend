import React, { useEffect,useState } from 'react'
import { createContext,useContext } from 'react'
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

export const ChatState = ()=>{
    const state= useContext(ChatContext)
    return state
}

const ChatProvider = ({children}) => {

    const [user,setUser] = useState();
    const [selectedChat,setSelectedChat]  = useState();
    const[chats,setChats] = useState([])
    const navigate = useNavigate();

    useEffect(()=>{
        const userData = JSON.parse(localStorage.getItem("userdata"))
        setUser(userData)
        
        if(!userData)
        {
            navigate("/")
        }
    },[navigate])

  return (
    <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats}}>
    {children}
    </ChatContext.Provider>
  )
}


export default ChatProvider;