import { StyleSheet, Text, View, Image, TextInput, Pressable, ScrollView, TouchableOpacity, Alert, Button } from 'react-native';
import { Link, router, useRouter } from "expo-router";
import { useAuth } from '@/auth/AuthContext';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_STORAGE } from '@/firebaseConfig';


export default function Profile() {
  const { user, userInfo, fetchUserInfo, logout, uploadProfilePicture } = useAuth();
  const [username, setUsername] = useState(userInfo?.username || "");
  const [bio, setBio] = useState(userInfo?.bio || "");

  const updateProfile = async () => {
    if (!user) return;

    try {
      const userRef = doc(FIREBASE_DB, "users", user.uid);
      await updateDoc(userRef, { username, bio });

      await fetchUserInfo(user.uid); // Refresh user info
      alert("Profile updated!");
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/Login/login");
  };

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Button style={styles.button} title="Logout" onPress={handleLogout} />
        <Text style={styles.title}>Profile Card</Text>
        
      </View>

      <View style={styles.profileContainer}>
        <TouchableOpacity style={styles.profileImage} onPress={() => uploadProfilePicture(userInfo?.uid)}>
          <Image
            source={{ uri: userInfo?.profilePicture || "https://via.placeholder.com/150" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your name"
        />
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio} 
          onChangeText={setBio}
          placeholder="Enter a short bio"
          multiline
        />
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.buttonText}>
          <Text style={styles.buttonLabel} onPress={updateProfile}>UPDATE</Text>
        </Pressable>
      </View>
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '10%',
  },
  buttonArea: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    
  },
  buttonIcon: {
    width: '20%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f44336',
    borderRadius: 25,
  },
  button: {
    fontSize: 20,
    color: 'red',
    padding: 10,
  },
  iconText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
