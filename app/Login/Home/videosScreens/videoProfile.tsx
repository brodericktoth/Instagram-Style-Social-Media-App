import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebaseConfig';

export default function Profile() {
  const { videoUserId } = useLocalSearchParams(); // Access the passed parameter
  const [videoUser, setVideoUser] = useState<any>(null);
  const [userVideos, setUserVideos] = useState<any[]>([]);

  const fetchVideoUserinfo = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(FIREBASE_DB, "users", uid));
      if (userDoc.exists()) {
        setVideoUser(userDoc.data());
      } else {
        console.log("No user info found!");
      }
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  };

  const fetchUserVideos = async (uid: string) => {
    try {
      const q = query(
        collection(FIREBASE_DB, "videos"),
        where("uid", "==", uid),
        orderBy("timestamp", "desc") // Sort by timestamp in descending order (newest first)
      );
      const querySnapshot = await getDocs(q);
      const videos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserVideos(videos);
    } catch (error) {
      console.log("Error fetching user videos:", error);
    }
  };

  useEffect(() => {
    if (videoUserId) {
      fetchVideoUserinfo(videoUserId); // Fetch user info
      fetchUserVideos(videoUserId); // Fetch user's videos
    }
  }, [videoUserId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {videoUser ? (
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: videoUser.profilePicture || "https://via.placeholder.com/150" }}
            style={styles.profileImage}
          />
          <Text style={styles.title}>{videoUser.username || "Unknown User"}</Text>
          <Text style={styles.bio}>{videoUser.bio || "No bio available."}</Text>
        </View>
      ) : (
        <Text>Loading user information...</Text>
      )}

      <FlatList
        data={userVideos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.videoItem}>
            <Text style={styles.caption}>{item.caption}</Text>
            <Text style={styles.likes}>Likes: {item.likes}</Text>
          </View>
          
        )}
      />
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
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#aaa',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 10,
  },
  bio: {
    fontSize: 18,
    color: '#666',
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    textAlign: 'center',
    marginTop: 10,
  },
  videoItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  caption: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  likes: {
    fontSize: 14,
    color: '#666',
  },
});