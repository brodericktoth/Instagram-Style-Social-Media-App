import { AuthProvider } from '@/auth/AuthContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="home" options={{ title: 'Home' , headerShown:false}} />
        <Stack.Screen name="videoProfile" options={{ title: 'Profile' }} />
        <Stack.Screen name="popularUsers" options={{ title: 'Popular Users' }} />
      </Stack>
    </AuthProvider>
  );
}
