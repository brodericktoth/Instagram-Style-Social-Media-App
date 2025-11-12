import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useAuth } from "@/auth/AuthContext";
import { sendMessage } from "@/utils/firestoreHelpers";

const MessageInput = ({ recipientId }) => {
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const handleSend = async () => {
    if (message.trim()) {
      await sendMessage(user.uid, recipientId, message);
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={message}
        onChangeText={setMessage}
        onSubmitEditing={handleSend}
        returnKeyType="send" // Makes the Enter key say "Send"
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
});

export default MessageInput;