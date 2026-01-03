import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, Image } from 'react-native';
import { ChatState } from '../context/ChatProvider';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { YStack, XStack, Text, Input, H2, Spinner, Separator, Avatar, Circle } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

const ChatListScreen = ({ navigation }) => {
    const { user, chats, setChats, setSelectedChat } = ChatState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    // Hide default header to use custom one
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get("http://192.168.29.218:5001/api/chat", config);
            setChats(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (user) fetchChats();
    }, [user]);

    const logout = async () => {
        await SecureStore.deleteItemAsync('userInfo');
        navigation.navigate('Login');
    };

    const handleSearch = async () => {
        if (!search) return;
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`http://192.168.29.218:5001/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoading(true);
            const config = { headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`http://192.168.29.218:5001/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            setLoading(false);
            setSearchResult([]);
            setSearch("");
            navigation.navigate('SingleChat');
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const getChatName = (chat) => {
        return chat.isGroup ? chat.groupName : chat.participants.find(p => p._id !== user._id).name;
    };

    const getChatImage = (chat) => {
        if (chat.isGroup) return "https://ui-avatars.com/api/?name=Group";
        const otherUser = chat.participants.find(p => p._id !== user._id);
        return `https://i.pravatar.cc/150?u=${otherUser._id}`;
    };

    return (
        <YStack f={1} bc="white" pt="$6" p="$4">
            {/* Custom Header */}
            <XStack jc="space-between" ai="center" mb="$4">
                <XStack ai="center" space="$3">
                    <Avatar circular size="$4">
                        <Avatar.Image src={`https://i.pravatar.cc/150?u=${user?._id}`} />
                        <Avatar.Fallback bc="gray" />
                    </Avatar>
                    <H2 fontWeight="800">Chats</H2>
                </XStack>
                <XStack space="$3">
                    <Circle size="$4" bc="#f0f0f0" onPress={logout}>
                        <Ionicons name="camera" size={20} color="black" />
                    </Circle>
                    <Circle size="$4" bc="#f0f0f0">
                        <Ionicons name="pencil" size={20} color="black" />
                    </Circle>
                </XStack>
            </XStack>

            {/* Search Bar */}
            <XStack bc="#f0f0f0" br="$10" p="$2" ai="center" space="$2" mb="$4" px="$4">
                <Ionicons name="search" size={20} color="#8e8e93" />
                <Input
                    f={1}
                    unstyled
                    placeholder="Search"
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor="#8e8e93"
                    onSubmitEditing={handleSearch}
                />
            </XStack>

            {/* Search Results */}
            {searchResult.length > 0 && (
                <YStack mb="$4" bc="white" p="$3" space="$2" zi={100} pos="absolute" t={140} l={0} r={0} shac="black" shar={10} shap={0.1}>
                    <Text fontWeight="bold" mb="$2">Search Results:</Text>
                    {searchResult.map((u) => (
                        <TouchableOpacity key={u._id} onPress={() => accessChat(u._id)}>
                            <XStack p="$2" ai="center" space="$3">
                                <Avatar circular size="$3">
                                    <Avatar.Image src={`https://i.pravatar.cc/150?u=${u._id}`} />
                                    <Avatar.Fallback bc="#ccc" />
                                </Avatar>
                                <YStack>
                                    <Text fontWeight="600">{u.name}</Text>
                                    <Text fontSize="$2" color="$gray10">{u.email}</Text>
                                </YStack>
                            </XStack>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => setSearchResult([])}>
                        <Text color="blue" ta="center" mt="$2">Close Search</Text>
                    </TouchableOpacity>
                </YStack>
            )}

            {/* Chat List */}
            <FlatList
                data={chats}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedChat(item);
                            navigation.navigate('SingleChat');
                        }}
                    >
                        <XStack ai="center" space="$3" py="$2">
                            <Avatar circular size="$5">
                                <Avatar.Image src={getChatImage(item)} />
                                <Avatar.Fallback bc="#ccc" />
                            </Avatar>
                            <YStack f={1}>
                                <Text fontSize="$5" fontWeight="600" color="black">
                                    {getChatName(item)}
                                </Text>
                                <XStack ai="center" space="$2">
                                    <Text fontSize="$3" color="#65676b" numberOfLines={1}>
                                        {item.latestMessage ? item.latestMessage.content : "Start a conversation"}
                                    </Text>
                                    <Text fontSize="$3" color="#65676b">· 11:40</Text>
                                </XStack>
                            </YStack>
                            {/* Optional: Add seen indicator or unread badge here */}
                            <Ionicons name="checkmark-circle-outline" size={16} color="#ccc" />
                        </XStack>
                    </TouchableOpacity>
                )}
            />
        </YStack>
    );
};

export default ChatListScreen;
