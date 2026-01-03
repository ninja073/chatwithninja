import React, { useState } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ChatState } from '../context/ChatProvider';
import { YStack, H2, Input, Button, Text, XStack, Spinner } from 'tamagui';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser } = ChatState();

    const handleRegister = async () => {
        setLoading(true);
        try {
            const config = { headers: { "Content-type": "application/json" } };
            const { data } = await axios.post("http://192.168.29.218:5001/api/user", { name, email, password }, config);

            await SecureStore.setItemAsync('userInfo', JSON.stringify(data));
            setUser(data);
            navigation.navigate('ChatList');
        } catch (error) {
            console.log(error);
            Alert.alert("Registration Failed", error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <YStack f={1} bc="$background" ai="center" jc="center" p="$4" space="$5">
            <YStack space="$2" ai="center">
                <H2 color="$color">Create Account</H2>
                <Text color="$color10">Sign up to get started</Text>
            </YStack>

            <YStack w="100%" space="$4" maw={400}>
                <Input
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    size="$4"
                />
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
                    onPress={handleRegister}
                    disabled={loading}
                    icon={loading ? <Spinner /> : undefined}
                >
                    Register
                </Button>
            </YStack>

            <XStack space="$2">
                <Text color="$color">Already have an account?</Text>
                <Text
                    color="$blue10"
                    fontWeight="bold"
                    onPress={() => navigation.navigate('Login')}
                >
                    Login
                </Text>
            </XStack>
        </YStack>
    );
};

export default RegisterScreen;
