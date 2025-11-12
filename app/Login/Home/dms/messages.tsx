import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";
import { collection, getDocs, query, where, startAt, endAt, limit, orderBy, getDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebaseConfig";
import { useAuth } from "@/auth/AuthContext";
import { router } from "expo-router";

const MessagingScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<{ id: string; username: string }[]>([]);
  const [conversations, setConversations] = useState<{ id: string; lastMessage: string; participants: string[]; recipientId: string; recipientUsername: string }[]>([]);
  const { userInfo } = useAuth(); // Get userInfo from the AuthContext
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    if (userInfo && userInfo.uid) {
      const getConversations = async () => {
        const conversations = await fetchConversations(userInfo.uid);
        setConversations(conversations);
        setLoading(false); // Set loading to false after fetching conversations
      };

      getConversations();
    }
  }, [userInfo]);

  const handleSearch = async () => {
    if (!searchTerm) {
      setUsers([]);
      return;
    }

    try {
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("username_lowercase", ">=", searchTerm.toLowerCase()),
        where("username_lowercase", "<=", searchTerm.toLowerCase() + "\uf8ff")
      );

      const snapshot = await getDocs(q);
      const result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(result);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const handleUserPress = (recipientUser: { id: string; username: string }) => {
    if (recipientUser.id === userInfo.uid) {
      router.push("/Login/Home/profile");
    } else {
      router.push({
        pathname: "/Login/Home/dms/chat",
        params: { recipientId: recipientUser.id, recipientUsername: recipientUser.username },
      });
    }
  };

  const fetchConversations = async (userId: string) => {
    try {
      const q = query(
        collection(FIREBASE_DB, "directmessages"),
        where("participants", "array-contains", userId) // Query for conversations containing the userId
      );
  
      const snapshot = await getDocs(q);
  
      const conversations = await Promise.all(
        snapshot.docs.map(async (conversationDoc) => {
          const data = conversationDoc.data();
          const recipientId = data.participants.find((id: string) => id !== userId); // Get the other participant's ID
  
          // Fetch recipient's username from the users collection
          const recipientDoc = await getDoc(doc(FIREBASE_DB, "users", recipientId));
          const recipientUsername = recipientDoc.exists()
            ? (recipientDoc.data() as { username: string }).username
            : "Unknown User";
  
          return {
            id: conversationDoc.id, // conversationId
            lastMessage: data.lastMessage || "",
            lastUpdated: data.lastUpdated || null, // Ensure lastUpdated is included
            participants: data.participants,
            recipientId,
            recipientUsername, // Add recipient's username
          };
        })
      );
  
      // Sort conversations by the most recent `lastUpdated` timestamp
      conversations.sort((a, b) => {
        if (!a.lastUpdated || !b.lastUpdated) return 0; // Handle missing timestamps
        return b.lastUpdated.toMillis() - a.lastUpdated.toMillis(); // Sort descending
      });
  
      console.log("Conversations:", conversations);
      return conversations;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return [];
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.input}
        placeholder="Search for users..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
  
      {/* First FlatList (Users) */}
      <View style={styles.overlay}>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(item)}>
              <Text style={styles.username}>{item.username}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={null} // Prevent empty space when no users are found
        />
      </View>
  
      {/* Second FlatList (Conversations) */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => handleUserPress({ id: item.recipientId, username: item.recipientUsername })}
          >
            <Text style={styles.username}>Chat with: {item.recipientUsername}</Text>
            <Text style={styles.lastMessage}>Last Message: {item.lastMessage}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No conversations found.</Text>}
      />
    </View>
  );
};

export default MessagingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  userItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  conversationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
  },
  lastMessage: {
    fontSize: 14,
    color: "#555",
  },
});
