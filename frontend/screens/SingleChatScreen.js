import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatState } from '../context/ChatProvider';
import axios from 'axios';
import io from 'socket.io-client';

const ENDPOINT = "http://192.168.29.218:5001";
var socket, selectedChatCompare;

const SingleChatScreen = () => {
    const { user, selectedChat } = ChatState();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageRecieved) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageRecieved.chatId._id
            ) {
                // notification
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get(`${ENDPOINT}/api/message/${selectedChat._id}`, config);
            setMessages(data);
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            console.error(error);
        }
    };

    const sendMessage = async () => {
        if (newMessage) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };

                const { data } = await axios.post(`${ENDPOINT}/api/message`, {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);

                setNewMessage("");
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 140 : 0}
            style={styles.container}
        >
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{selectedChat.isGroup ? selectedChat.groupName : selectedChat.participants.find(p => p._id !== user._id).name}</Text>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <Text style={item.senderId._id === user._id ? styles.myMessage : styles.otherMessage}>
                            {item.text}
                        </Text>
                    )}
                />
                <View style={[styles.inputContainer, { marginBottom: Platform.OS === 'ios' ? 10 : 20 }]}>
                    <TextInput
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message..."
                        style={styles.input}
                    />
                    <Button title="Send" onPress={sendMessage} />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    myMessage: { alignSelf: 'flex-end', backgroundColor: '#dcf8c6', padding: 10, borderRadius: 10, marginVertical: 5 },
    otherMessage: { alignSelf: 'flex-start', backgroundColor: '#fff', padding: 10, borderRadius: 10, marginVertical: 5 },
    inputContainer: { flexDirection: 'row', alignItems: 'center' },
    input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, padding: 10, marginRight: 10 }
});

export default SingleChatScreen;
