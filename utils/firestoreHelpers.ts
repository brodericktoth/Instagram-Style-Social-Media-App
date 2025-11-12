import { collection, addDoc, query, where, getDocs, orderBy, setDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebaseConfig";

// Function to send a message
export const sendMessage = async (senderId: string, recipientId: string, messageContent: string) => {
  try {
    const conversationId = [senderId, recipientId].sort().join("_"); // Generate consistent conversation ID
      
    // Define the message data
    const messageData = {
      senderId,
      recipientId,
      content: messageContent,
      timestamp: new Date(),
    };

    // Add the message to the messages subcollection
    await addDoc(collection(FIREBASE_DB, `directmessages/${conversationId}/messages`), messageData);
    const recentMessage ={
      participants: [senderId, recipientId], // Ensure participants are stored
      lastMessage: messageContent, // Store the last message content
      lastUpdated: messageData.timestamp, // Store the timestamp of the last message
    }
    // Update the parent document in the directmessages collection
    
    await setDoc(doc(FIREBASE_DB, "directmessages", conversationId), recentMessage);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Function to retrieve messages between two users
export const getMessages = async (senderId: string, recipientId: string) => {
  try {
    const conversationId = [senderId, recipientId].sort().join("_"); // Generate consistent conversation ID
    const messagesRef = collection(FIREBASE_DB, `directmessages/${conversationId}/messages`);
    const q = query(messagesRef, orderBy("timestamp"));

    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return messages;
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return [];
  }
};