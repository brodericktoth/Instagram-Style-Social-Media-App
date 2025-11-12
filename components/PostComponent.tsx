import React from "react";
import { Text, View, FlatList, ActivityIndicator, Alert, StyleSheet, Dimensions, TouchableOpacity, useWindowDimensions  } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { arrayRemove, arrayUnion, collection, doc, getDocs, increment, orderBy, query, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebaseConfig";
import { useAuth } from "@/auth/AuthContext";
import { AntDesign } from "@expo/vector-icons";
import { Image, type ImageSource } from 'expo-image';



type Props = {
  videoURL: string;
  videoId: string;
  likes: number;
  likeUsers: string[];
  caption: string;
  currentUserId: string;
  username?: string;
  toggleLike: (videoId: string, isLiked: boolean, userId: string) => void;
  onProfilePress: () => void;
  videoRef?: React.RefObject<Video>;
};

const PostComponent: React.FC<Props> = ({
  videoURL,
  videoId,
  likes,
  likeUsers,
  caption,
  currentUserId,
  toggleLike,
  onProfilePress,
  videoRef
}) => {
  const isLiked = likeUsers?.includes(currentUserId);

  const { height, width:screenWidth } = useWindowDimensions(); 
  const videoHeight = screenWidth * (9 / 16);
  return (
    <View style={{alignItems: "center" , width: "100%"}}>

      <View style={[styles.videoContainer, {width: 1800, height: 2050 }]}>
        <Video
          ref={videoRef}
          source={{ uri: videoURL }}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          shouldPlay={false}
          
        />

      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity onPress={() => toggleLike(videoId, isLiked, currentUserId)}>
          <AntDesign name={isLiked ? "heart" : "hearto"} size={24} color={isLiked ? "red" : "black"} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 8 }}>{likes} Likes</Text>
        <TouchableOpacity onPress={onProfilePress}>
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", flexWrap: "wrap", margin: 25 }}>
          {renderStyledCaption(caption)}
        </View>

      </View>
    </View>
  );
};

const renderStyledCaption = (caption: string) => {
  const parts = caption.split(/(\s+|\n)/); // keep spaces and newlines
  return parts.map((part, index) => {
    if (/^#\w+/.test(part)) {
      return (
        <Text key={index} style={styles.hashtag}>
          {part}
        </Text>
      );
    }
    return (
      <Text key={index} style={styles.captionText}>
        {part}
      </Text>
    );
  });
};



const styles = StyleSheet.create({
  video: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainer:{
    justifyContent: "center",
    alignItems: "center",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    position: "absolute",
    bottom: 80,
    left: 20,
  },
  profileText: {
    marginLeft: 20,
    color: "#007AFF",
    fontWeight: "bold",
  },
  captionText: {
    color: "#000",
    fontSize: 16,
  },
  
  hashtag: {
    color: "#1DA1F2", // Twitter-blue or pick another
    fontSize: 16,
    fontWeight: "bold",
  },
  
});

export default PostComponent;
