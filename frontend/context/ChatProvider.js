import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userInfo = await SecureStore.getItemAsync('userInfo');
                if (userInfo) {
                    setUser(JSON.parse(userInfo));
                }
            } catch (error) {
                console.log("Error fetching user info", error);
            }
        };
        fetchUser();
    }, []);

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
