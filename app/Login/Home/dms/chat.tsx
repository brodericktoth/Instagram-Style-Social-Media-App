import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { collection, query, where, onSnapshot, orderBy, addDoc, doc, CollectionReference, DocumentData, setDoc } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebaseConfig";
import MessageInput from "@/components/MessageInput";
import MessageBubble from "@/components/MessageBubble";
import { useAuth } from "@/auth/AuthContext";
import { useLocalSearchParams } from 'expo-router';


const ChatScreen = () => {
  const { recipientId, recipientUsername } = useLocalSearchParams(); // Get recipient ID from route params
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const conversationId = [user.uid, recipientId].sort().join("_"); // Generate consistent conversation ID
    const messagesRef = collection(FIREBASE_DB, `directmessages/${conversationId}/messages`); // Use conversationId in the path
    const q = query(messagesRef, orderBy("timestamp", "desc"));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesData);
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, [recipientId, user.uid]);
  

  return (
    <View style={styles.container}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{recipientUsername}</Text>
      </View>
      {loading ? (
        <Text>Loading messages...</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble message={item} currentUserId={user.uid} />
          )}
          showsVerticalScrollIndicator={false}
          inverted
        />
      )}
      <MessageInput recipientId={recipientId} />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});

