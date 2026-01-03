import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

import ChatListScreen from './screens/ChatListScreen';
import SingleChatScreen from './screens/SingleChatScreen';
import ChatProvider from './context/ChatProvider';
import { TamaguiProvider, Theme } from 'tamagui';
import config from './tamagui.config';
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name="light">
        <ChatProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="ChatList" component={ChatListScreen} />
              <Stack.Screen name="SingleChat" component={SingleChatScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ChatProvider>
      </Theme>
    </TamaguiProvider>
  );
}
