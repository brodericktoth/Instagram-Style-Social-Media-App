import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'About' , headerShown:false}} />
      <Stack.Screen name="/Login/login" options={{ title: 'Login' , headerShown:false}} />
    </Stack>
  );
}
