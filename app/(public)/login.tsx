import { useSignIn, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Text,
  Alert,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Spinner from "react-native-loading-spinner-overlay";
import Loginscreen from "@/components/Loginscreen";

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { user } = useUser();
  const [showpass, setshowpass] = useState(false);

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldUpdateUsername, setShouldUpdateUsername] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });

      // Trigger username update once user is active
      setShouldUpdateUsername(true);
    } catch (err: any) {
      alert(err.errors[0]?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />

      <TextInput
        autoCapitalize="none"
        placeholder="Email (e.g. test@test.com)"
        value={emailAddress}
        onChangeText={setEmailAddress}
        style={styles.inputField}
      />
      <View>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={showpass == false ? true : false}
          style={styles.inputField}
        />
        <View
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: [{ translateY: -12 }],
          }}
        >
          <Feather name="eye" size={24} color="black" />
        </View>
      </View>

      <Button onPress={onSignInPress} title="Login" color={"#6c47ff"} />

      <Link href="../reset" asChild>
        <Pressable style={styles.button}>
          <Text>Forgot password?</Text>
        </Pressable>
      </Link>
      <Link href="../register" asChild>
        <Pressable style={styles.button}>
          <Text>Create Account</Text>
        </Pressable>
      </Link>

      <Loginscreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
});

export default Login;
