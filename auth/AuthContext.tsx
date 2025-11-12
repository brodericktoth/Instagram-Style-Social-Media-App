import React, { createContext, useState, useContext, useEffect } from "react"; 
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// 1. Create a context 
const AuthContext = createContext(); 
 
// 2. Create the provider component 
export const AuthProvider = ({ children }) => { 
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  // Fetch user info from Firestore
  const fetchUserInfo = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(FIREBASE_DB, "users", uid));
      if (userDoc.exists()) {
        setUserInfo(userDoc.data());
      } else {
        console.log("No user info found!");
      }
    } catch (error) {
      console.log("Error fetching user info:", error);
    }
  };

  const uploadProfilePicture = async (uid: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      const storageRef = ref(FIREBASE_STORAGE, `profilePictures/${uid}`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      await updateDoc(doc(FIREBASE_DB, "users", uid), {
        profilePicture: downloadURL,
      });

      setUserInfo({ ...userInfo, profilePicture: downloadURL });
      alert("Profile picture updated!");
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const newUser = userCredential.user;

      const userData = {
        uid: newUser.uid,
        username,
        username_lowercase: username.toLowerCase(),
        email,
        profilePicture: "",
        bio: ""
      };

      // Store user profile in Firestore
      await setDoc(doc(FIREBASE_DB, "users", newUser.uid), userData);

      setUser(newUser);
      setUserInfo(userData);

      router.push("/Login/login");
      alert("Account created successfully!");
      
    } catch (error) {
      alert(error.message);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const loggedInUser = userCredential.user;

      setUser(loggedInUser);
      await fetchUserInfo(loggedInUser.uid);

      router.push("/Login/Home/videosScreens/home");
      alert("Logged in successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      setUser(null);
      setUserInfo(null);
      alert("Logged out successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserInfo(currentUser.uid);
      } else {
        setUserInfo(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userInfo, signUp, login, logout, fetchUserInfo, uploadProfilePicture}}>
      {children}
    </AuthContext.Provider>
  );
}; 
 
// 3.Create a custom hook for easier use 
export const useAuth = () => useContext(AuthContext);