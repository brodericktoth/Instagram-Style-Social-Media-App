import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebaseConfig";

export default function PopularUsers() {
  const { hashtag } = useLocalSearchParams(); // Get the hashtag from the route params
  const [popularUsers, setPopularUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPopularUsers = async (hashtag: string) => {
    try {
      const q = query(collection(FIREBASE_DB, "videos"), where("hashtags", "array-contains", hashtag));
      const querySnapshot = await getDocs(q);
  
      const userLikesMap: { [uid: string]: { user: string; profilePicture: string; totalLikes: number } } = {};
  
      for (const videoDoc of querySnapshot.docs) {
        const data = videoDoc.data();
        const { uid, user, likes } = data;
  
        if (!userLikesMap[uid]) {
          // Fetch user info from the `users` collection
          const userDoc = await getDoc(doc(FIREBASE_DB, "users", uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            userLikesMap[uid] = {
              user,
              profilePicture: userData.profilePicture || "https://via.placeholder.com/150", // Default profile picture
              totalLikes: likes,
            };
          }
        } else {
          userLikesMap[uid].totalLikes += likes;
        }
      }
  
      // Convert the map to an array and sort by totalLikes in descending order
      const sortedUsers = Object.entries(userLikesMap)
        .map(([uid, userData]) => ({ uid, ...userData }))
        .sort((a, b) => b.totalLikes - a.totalLikes);
  
      setPopularUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching popular users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hashtag) {
      fetchPopularUsers(hashtag as string);
    }
  }, [hashtag]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular Users for {hashtag}</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={popularUsers}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Image source={{ uri: item.profilePicture || "https://via.placeholder.com/150" }} style={styles.profileImage} />
              <View>
                <Text style={styles.username}>{item.user}</Text>
                <Text style={styles.totalLikes}>Total Likes: {item.totalLikes}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalLikes: {
    fontSize: 16,
    color: "#666",
  },
});