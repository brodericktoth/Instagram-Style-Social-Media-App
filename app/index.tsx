import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}> About:</Text>
      <Text style={styles.text}> This is and app that people can use to post videos and message friends!</Text>
      <Text> </Text>
	  <Link href="/Login/login" style={styles.button}>
		Login Screen
	  </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#25292e',
    fontWeight: 'bold',
    fontSize: 30
  },
  button: {
	fontSize: 20,
  fontWeight: 'bold',
	color: 'red',
  },
});
