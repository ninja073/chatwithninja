import React, { useEffect, useState, useRef } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatState } from '../context/ChatProvider';
import axios from 'axios';
import io from 'socket.io-client';
import { YStack, XStack, Text, Input, Avatar, Circle } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

const ENDPOINT = "http://192.168.29.218:5001";
var socket, selectedChatCompare;

const SingleChatScreen = ({ navigation }) => {
    const { user, selectedChat } = ChatState();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const insets = useSafeAreaInsets();
    const flatListRef = useRef();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

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

    const getOtherUser = () => {
        if (!selectedChat) { return {} };
        if (selectedChat.isGroup) {
            return { name: selectedChat.groupName, _id: "group" };
        }
        return selectedChat.participants.find(p => p._id !== user._id);
    };

    const otherUser = getOtherUser();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            style={{ flex: 1 }}
        >
            <YStack f={1} bc="white">
                {/* Custom Header */}
                <XStack
                    pt={insets.top}
                    pb="$2"
                    px="$2"
                    ai="center"
                    jc="space-between"
                    bc="white"
                    shac="black"
                    shar={1}
                    shap={0.05}
                    zi={10}
                >
                    <XStack ai="center" space="$2">
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back" size={28} color="#0084FF" />
                        </TouchableOpacity>
                        <XStack ai="center" space="$2">
                            <Avatar circular size="$3">
                                <Avatar.Image src={selectedChat.isGroup ? "https://ui-avatars.com/api/?name=Group" : `https://i.pravatar.cc/150?u=${otherUser._id}`} />
                                <Avatar.Fallback bc="#ccc" />
                            </Avatar>
                            <YStack>
                                <Text fontWeight="700" fontSize={16}>{otherUser.name}</Text>
                                <Text fontSize={12} color="#65676b">Active now</Text>
                            </YStack>
                        </XStack>
                    </XStack>
                    <XStack space="$4" pr="$2">
                        <Ionicons name="call" size={24} color="#0084FF" />
                        <Ionicons name="videocam" size={24} color="#0084FF" />
                        <Ionicons name="information-circle" size={24} color="#0084FF" />
                    </XStack>
                </XStack>

                <FlatList
                    ref={flatListRef}
                    onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
                    data={messages}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
                    renderItem={({ item, index }) => {
                        const isMine = item.senderId._id === user._id;
                        const isLastFromUser = index === messages.length - 1 || messages[index + 1]?.senderId._id !== item.senderId._id;

                        return (
                            <XStack jc={isMine ? 'flex-end' : 'flex-start'} mb="$1" ai="flex-end" space="$2">
                                {!isMine && (
                                    <Avatar circular size="$2" o={isLastFromUser ? 1 : 0}>
                                        <Avatar.Image src={`https://i.pravatar.cc/150?u=${item.senderId._id}`} />
                                        <Avatar.Fallback bc="#ccc" />
                                    </Avatar>
                                )}
                                <YStack
                                    backgroundColor={isMine ? '#0084FF' : '#F0F0F0'}
                                    px="$3"
                                    py="$2"
                                    br="$5"
                                    btrr={isMine ? 5 : 20}
                                    btlr={!isMine ? 5 : 20}
                                    bbrr={20}
                                    bblr={20}
                                    maw="75%"
                                >
                                    <Text color={isMine ? 'white' : 'black'} fontSize={15}>{item.text}</Text>
                                </YStack>
                                {isMine && isLastFromUser && (
                                    <Ionicons name="checkmark-circle" size={14} color="#0084FF" style={{ marginBottom: 2 }} />
                                )}
                            </XStack>
                        );
                    }}
                />

                {/* Messenger Style Input Bar */}
                <XStack
                    p="$2"
                    bg="white"
                    ai="center"
                    space="$2"
                    pb={insets.bottom > 0 ? insets.bottom : "$2"}
                >
                    <TouchableOpacity>
                        <Ionicons name="add-circle" size={28} color="#0084FF" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="camera" size={26} color="#0084FF" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="image" size={26} color="#0084FF" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="mic" size={26} color="#0084FF" />
                    </TouchableOpacity>

                    <Input
                        f={1}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Aa"
                        br="$10"
                        bc="#F0F0F0"
                        bw={0}
                        px="$3"
                        py="$2"
                        minHeight={36}
                    />

                    {newMessage ? (
                        <TouchableOpacity onPress={sendMessage}>
                            <Ionicons name="send" size={28} color="#0084FF" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity>
                            <Ionicons name="thumbs-up" size={28} color="#0084FF" />
                        </TouchableOpacity>
                    )}
                </XStack>
            </YStack>
        </KeyboardAvoidingView>
    );
};

export default SingleChatScreen;
