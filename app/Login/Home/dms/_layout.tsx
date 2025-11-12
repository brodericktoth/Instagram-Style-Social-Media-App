import { AuthProvider } from '@/auth/AuthContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="messages" options={{ title: 'Message' , headerShown:false}} />
        <Stack.Screen name="chat" options={{ title: 'Chat' }} />
      </Stack>
    </AuthProvider>
  );
}
