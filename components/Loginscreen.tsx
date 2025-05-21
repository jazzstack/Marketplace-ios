import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  useWarmUpBrowser();
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = useCallback(async () => {
    try {
      console.log("Starting Google OAuth flow...");
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      console.log("OAuth flow completed:", {
        createdSessionId: !!createdSessionId,
        signIn: !!signIn,
        signUp: !!signUp,
      });

      if (createdSessionId) {
        console.log("Setting active session...");
        await setActive?.({ session: createdSessionId });
        router.replace("(auth)/home" as any);
      } else {
        console.log("No session created");
        if (signIn || signUp) {
          console.log("Additional verification needed");
          Alert.alert(
            "Verification Required",
            "Please complete the verification process."
          );
        } else {
          Alert.alert(
            "Sign In Failed",
            "Unable to sign in with Google. Please try again."
          );
        }
      }
    } catch (err: any) {
      console.error("OAuth Error:", err);
      Alert.alert(
        "Authentication Error",
        err.message || "An error occurred during sign in. Please try again."
      );
    }
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <AntDesign name="google" size={20} color="red" />
        </View>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: "5%",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderWidth: 1,
    borderColor: "#dadce0",
  },
  iconContainer: {
    marginRight: 12,
    width: 24,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    padding: 2,
  },
  buttonText: {
    color: "#3c4043",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.25,
  },
});
