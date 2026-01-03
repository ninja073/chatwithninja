import React, { useState } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ChatState } from '../context/ChatProvider';
import { YStack, H2, ParsedText, Input, Button, Text, XStack, Anchor, Form, Spinner } from 'tamagui';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser } = ChatState();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const config = { headers: { "Content-type": "application/json" } };
            // Note: Use your IP address here as per README instructions if not localhost
            const { data } = await axios.post("http://192.168.29.218:5001/api/user/login", { email, password }, config);

            await SecureStore.setItemAsync('userInfo', JSON.stringify(data));
            setUser(data);
            navigation.navigate('ChatList');
        } catch (error) {
            console.log(error);
            Alert.alert("Login Failed", error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <YStack f={1} bc="$background" ai="center" jc="center" p="$4" space="$5">
            <YStack space="$2" ai="center">
                <H2 color="$color">Welcome Back</H2>
                <Text color="$color10">Sign in to continue</Text>
            </YStack>

            <YStack w="100%" space="$4" maw={400}>
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    size="$4"
                />
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    size="$4"
                />

                <Button
                    theme="active"
                    size="$4"
                    onPress={handleLogin}
                    disabled={loading}
                    icon={loading ? <Spinner /> : undefined}
                >
                    Login
                </Button>
            </YStack>

            <XStack space="$2">
                <Text color="$color">Don't have an account?</Text>
                <Text
                    color="$blue10"
                    fontWeight="bold"
                    onPress={() => navigation.navigate('Register')}
                >
                    Register
                </Text>
            </XStack>
        </YStack>
    );
};

export default LoginScreen;
