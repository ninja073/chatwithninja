import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ChatState } from '../context/ChatProvider';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = ChatState();

    const handleLogin = async () => {
        try {
            const config = { headers: { "Content-type": "application/json" } };
            const { data } = await axios.post("http://192.168.29.218:5001/api/user/login", { email, password }, config);

            await SecureStore.setItemAsync('userInfo', JSON.stringify(data));
            setUser(data);
            navigation.navigate('ChatList');
        } catch (error) {
            console.log(error);
            alert("Login Failed");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 8 }
});

export default LoginScreen;
