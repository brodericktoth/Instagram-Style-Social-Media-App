import React, { useState } from "react";
import { StyleSheet, View, Button, ActivityIndicator, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FIREBASE_STORAGE, FIREBASE_DB } from "@/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "@/auth/AuthContext";
import { TextInput } from "react-native-gesture-handler";

const UploadScreen: React.FC<NativeStackScreenProps<any>> = ({ navigation }) => {
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  //const [hashtags, setHashtags] = useState("");
  const { userInfo } = useAuth();
  
  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      uploadVideo(result.assets[0].uri);
    }
  };

  const parseHashtags = (input: string): string[] => {
    return input.match(/#\w+/g) || [];
  };  

  const uploadVideo = async (uri: string) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const filename = `videos/${Date.now()}.mp4`;
      const storageRef = ref(FIREBASE_STORAGE, filename);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          Alert.alert("Upload failed!", error.message);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await saveVideoMetadata(downloadURL);
          setUploading(false);
          Alert.alert("Upload Successful!");
          //navigation.navigate("Home");
        }
      );
      setCaption("");
    } catch (error: any) {
      Alert.alert("Upload failed!", error.message);
      setUploading(false);
    }
  };

  const saveVideoMetadata = async (videoURL: string) => {
    const hashtags = parseHashtags(caption);
    
    await addDoc(collection(FIREBASE_DB, "videos"), {
      videoURL,
      timestamp: serverTimestamp(),
      likes: 0,
      likeUsers: [],
      user: userInfo?.username,
      email: userInfo?.email,
      uid: userInfo?.uid,
      caption,
      hashtags
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Pick a Video" onPress={pickVideo} />
      {uploading && <ActivityIndicator size="large" color="#0000ff" />}
      <TextInput
          style={[styles.input]}
          value={caption} 
          onChangeText={setCaption}
          placeholder="Enter a caption or hashtags"
          multiline
        />
    </View>
  );
};

export default UploadScreen;

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
