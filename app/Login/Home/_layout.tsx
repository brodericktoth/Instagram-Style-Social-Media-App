import { AuthProvider } from "@/auth/AuthContext";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
  <AuthProvider>
    <Tabs>
      <Tabs.Screen name="videosScreens" options={{ title: 'Home' , headerShown:false}} />
      <Tabs.Screen name="dms" options={{ title: 'Messages' , headerShown:false}} />
      <Tabs.Screen name="upload" options={{ title: 'Upload' , headerShown:false}} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' , headerShown:false}} />
    </Tabs>
  </AuthProvider>
  );
}
