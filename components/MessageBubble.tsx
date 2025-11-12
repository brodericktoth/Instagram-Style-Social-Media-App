import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ message, currentUserId }) => {
  const isSender = message.senderId === currentUserId;

  // Format the timestamp to include both date and time
  const formattedTimestamp =
    message.timestamp && message.timestamp.toDate
      ? `${new Date(message.timestamp.toDate()).toLocaleDateString()} ${new Date(
          message.timestamp.toDate()
        ).toLocaleTimeString()}`
      : "Invalid Date";

  return (
    <View style={[styles.bubble, isSender ? styles.sender : styles.receiver]}>
      <Text style={styles.messageText}>{message.content}</Text>
      <Text style={styles.timestamp}>{formattedTimestamp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    maxWidth: '80%',
  },
  sender: {
    backgroundColor: '#39ff5a',
    alignSelf: 'flex-end',
  },
  receiver: {
    backgroundColor: '#218aff',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    color: '#fff',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});

export default MessageBubble;