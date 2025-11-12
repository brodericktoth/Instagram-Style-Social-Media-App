import { Text, TextInput, View, StyleSheet, Button } from 'react-native';
import { useState } from 'react';
import { Link, router } from "expo-router";
import { useAuth } from "@/auth/AuthContext"; 
//import { userAuthorization } from "@/auth/AuthorizationContext"; 

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login} = useAuth();

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill in all fields!");
      return;
    }
    login(email, password);
  };


  const handleSignUp = () => {
    router.push("/Login/SignUpScreen");
  };

  
  function goHome(){
    const myJSON = JSON.stringify(user);
    //router.push(`/Screen2?myJSON=${encodeURIComponent(myJSON)}`); 

  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Enter your email and password</Text>
      <TextInput 
      style={styles.textInput}
      value = {email}
      onChangeText={(text)=> setEmail(text)}
      placeholder = "Email"
        />
      <TextInput 
      style={styles.textInput}
      value = {password}
      secureTextEntry={true}
      onChangeText={(text)=> setPassword(text)}
      placeholder = "Password"
        />

	  <Button style={styles.button} title="Login" onPress={handleLogin} />
	  <Button style={styles.button} title="Sign Up" onPress={handleSignUp} />

    </View>
  );
}

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
