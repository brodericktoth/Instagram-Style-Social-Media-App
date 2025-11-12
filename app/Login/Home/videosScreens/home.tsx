import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, FlatList, ActivityIndicator, Alert, StyleSheet, Dimensions, TextInput, Button } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, increment, orderBy, query, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebaseConfig";
import { useAuth } from "@/auth/AuthContext";
import { router } from "expo-router";
import PostComponent from "@/components/PostComponent"; // Adjust path if needed

const { height, width } = Dimensions.get("window"); // Get screen dimensions

const HomeScreen: React.FC = () => {
  const [videos, setVideos] = useState<{ id: string; videoURL: string; likes: number; likeUsers: string[]; caption:string ; uid:string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredVideos, setFilteredVideos] = useState<typeof videos>([]);
  const videoRefs = useRef<{ [key: string]: Video | null }>({}); // Store refs for videos
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null); // Track the currently visible video
  const { userInfo } = useAuth();
  
  //alert(height);
  //alert(width);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const q = query(collection(FIREBASE_DB, "videos"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const videoList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as { id: string; videoURL: string ; likes: number; likeUsers: string[]; caption:string ; uid:string}[];
        setVideos(videoList);
      } catch (error: any) {
        Alert.alert("Error", "Failed to load videos: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const toggleLike = async (videoId: string, isLiked: boolean, userId: string) => {
    const videoRef = doc(FIREBASE_DB, "videos", videoId);
  
    try {
      const videoSnap = await getDoc(videoRef);
  
      if (videoSnap.exists()) {
        const data = videoSnap.data();
        const likeUsers = data.likeUsers || [];
  
        let updatedLikeUsers;
  
        if (isLiked) {
          // Remove the user
          updatedLikeUsers = likeUsers.filter((id: string) => id !== userId);
        } else {
          // Add the user (only if not already in the array)
          updatedLikeUsers = likeUsers.includes(userId)
            ? likeUsers
            : [...likeUsers, userId];
        }
  
        // Update the document with the new array and its length
        await updateDoc(videoRef, {
          likeUsers: updatedLikeUsers,
          likes: updatedLikeUsers.length,
        });
  
        // Update the local state
        setVideos((prevVideos) =>
          prevVideos.map((video) =>
            video.id === videoId
              ? { ...video, likeUsers: updatedLikeUsers, likes: updatedLikeUsers.length }
              : video
          )
        );
  
        // If filteredVideos is being used, update it as well
        setFilteredVideos((prevFilteredVideos) =>
          prevFilteredVideos.map((video) =>
            video.id === videoId
              ? { ...video, likeUsers: updatedLikeUsers, likes: updatedLikeUsers.length }
              : video
          )
        );
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };
  

  const handleVideoProfile = (uid: string) => {
    router.push({
            pathname: "/Login/Home/videosScreens/videoProfile",
            params: { videoUserId: uid}
});
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      setFilteredVideos(videos); // reset if search is empty
      return;
    }
  
    const tag = searchText.trim(); // Keep the # in the search term
    const results = videos.filter(video =>
      (video as any).hashtags?.some((tagInFirestore: string) =>
        tagInFirestore === tag // Match exact tag with #
      )
    );
    setFilteredVideos(results);
  };  
  
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      const visibleVideoId = viewableItems[0]?.item?.id;
  
      // Pause all videos except the currently visible one
      Object.keys(videoRefs.current).forEach((videoId) => {
        if (videoId === visibleVideoId) {
          videoRefs.current[videoId]?.playAsync();
        } else {
          videoRefs.current[videoId]?.pauseAsync();
        }
      });
  
      setCurrentVideoId(visibleVideoId || null);
    },
    [] // Dependencies: Add any state or props that the function depends on
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 30, // Trigger when 50% of the video is visible
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.text}>Welcome, {userInfo?.username || "Guest"}!</Text>
      <View style={{ flexDirection: 'row', padding:10 ,paddingLeft: (width/2)-(width/11), alignItems:'center' }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            padding: 8,
            marginRight: 8,
          }}
          placeholder="Search hashtag (e.g. football)"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <Button title="Search" onPress={handleSearch} />
        <Button
          title="View Popular Users"
          onPress={() => {
            if (!searchText.trim()) {
              Alert.alert("Error", "Please enter a hashtag to search.");
              return;
            }
            router.push({
              pathname: "/Login/Home/videosScreens/popularUsers",
              params: { hashtag: searchText.trim() },
            });
          }}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
          data={filteredVideos.length > 0 || searchText ? filteredVideos : videos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <PostComponent
                videoURL={item.videoURL}
                videoId={item.id}
                likes={item.likes}
                likeUsers={item.likeUsers}
                caption={item.caption}
                currentUserId={userInfo.uid}
                toggleLike={toggleLike}
                onProfilePress={() => handleVideoProfile(item.uid)}
                videoRef={(ref: Video | null) => (videoRefs.current[item.id] = ref)} // Pass ref callback
              />
            </View>
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    color: '#000',
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center"
  }
});
