import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { ChatState } from '../context/ChatProvider';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const ChatListScreen = ({ navigation }) => {
    const { user, chats, setChats, setSelectedChat } = ChatState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Chats</Text>
                <Button title="Logout" onPress={logout} />
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search users by name or email"
                    style={styles.input}
                />
                <Button title="Search" onPress={handleSearch} />
            </View>

            {searchResult.length > 0 && (
                <View style={styles.searchResults}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Search Results:</Text>
                    {searchResult.map((u) => (
                        <TouchableOpacity key={u._id} onPress={() => accessChat(u._id)} style={styles.userItem}>
                            <Text>{u.name} ({u.email})</Text>
                        </TouchableOpacity>
                    ))}
                    <Button title="Clear Results" onPress={() => setSearchResult([])} />
                </View>
            )}

            <FlatList
                data={chats}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.chatItem}
                        onPress={() => {
                            setSelectedChat(item);
                            navigation.navigate('SingleChat');
                        }}
                    >
                        <Text style={styles.chatName}>
                            {item.isGroup ? item.groupName : item.participants.find(p => p._id !== user._id).name}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 50 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold' },
    chatItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    chatName: { fontSize: 18 },
    searchContainer: { flexDirection: 'row', marginBottom: 10 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ccc', marginRight: 10, padding: 8, borderRadius: 5 },
    searchResults: { marginBottom: 20, backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5 },
    userItem: { padding: 10, backgroundColor: 'white', marginBottom: 5, borderRadius: 5 }
});

export default ChatListScreen;
