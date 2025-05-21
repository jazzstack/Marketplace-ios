import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth, useOAuth } from "@clerk/clerk-expo";

export default function SSOCallback() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const { handleOAuthCallback } = useOAuth();

  const [hasHandledCallback, setHasHandledCallback] = useState(false);

  useEffect(() => {
    const processOAuth = async () => {
      try {
        await handleOAuthCallback(); // process the OAuth redirect
        setHasHandledCallback(true);
      } catch (err) {
        console.error("OAuth callback error", err);
        // Optionally navigate to error screen
        router.replace("/(public)/Welcome");
      }
    };

    if (isLoaded && !hasHandledCallback) {
      processOAuth();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (hasHandledCallback && isSignedIn) {
      router.replace("/(auth)/home");
    } else if (hasHandledCallback && !isSignedIn) {
      router.replace("/(public)/Welcome");
    }
  }, [hasHandledCallback, isSignedIn]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#6E75F4" />
    </View>
  );
}