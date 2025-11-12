import { AuthProvider } from '@/auth/AuthContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="login" options={{ title: 'Login' , headerShown:false}} />
        <Stack.Screen name="SignUpScreen" options={{ title: 'Sign Up' , headerShown:false}} />
        
      </Stack>
    </AuthProvider>
  );
}
