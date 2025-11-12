import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useAuth } from "@/auth/AuthContext";

const SignUpScreen = () => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSignUp = () => {
    if (!email || !password || !username) {
      alert("Please fill in all fields!");
      return;
    }
    signUp(email, password, username);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sign Up</Text>
      <TextInput style={styles.textInput} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.textInput} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.textInput} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button style={styles.button} title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

export default SignUpScreen;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: '#fff',
    },
    textInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
    },
    button: {
      fontSize: 20,
      color: 'red',
      padding: 10,
    },
  });
  