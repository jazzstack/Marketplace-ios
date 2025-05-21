import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "@/cache";
import { ContextProvider } from "../Context/DataContext";
import SyncUserToFirestore from "../components/Syncwithfirebase";
import { useUserRole, UserRoleProvider } from "../Context/RoleContext";
import { useEffect } from "react";
import { ThemeProvider } from "../Context/ThemeContext";
import { LocationProvider } from "../Context/LocationContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const publishableKey =
  "pk_test_ZXZvbHZlZC1maXJlZmx5LTUxLmNsZXJrLmFjY291bnRzLmRldiQ";

if (!publishableKey) {
  throw new Error("Missing publishableKey please provide it in your env file");
}

// ✅ This component is wrapped by the context provider, so it's safe to use the hook here
function AppContent() {
  const { fetchUserData, userData } = useUserRole(); // ✅ now this is safe
  // Optional: auto-fetch role
  useEffect(() => {
    fetchUserData();
  }, []);

  // useEffect(() => {
  //   console.log(userData);
  // }, [userData]);

  return (
    <>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(public)" options={{ headerShown: false }} />
        <Stack.Screen
          name="productDetails"
          options={{ headerShown: true, title: "Product Details" }}
        />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="sso-callback" options={{ headerShown: false }} />
        <Stack.Screen name="ItemDetails" />
        <Stack.Screen name="CategoryPage" options={{ headerShown: true }} />
        <Stack.Screen name="ChatScreen" options={{ headerShown: false }} />
      </Stack>

      <SignedIn>
        <SyncUserToFirestore />
      </SignedIn>
      <SignedOut>
        <Redirect href="../(public)/Welcome" />
      </SignedOut>
    </>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <UserRoleProvider>
        <ContextProvider>
          <ThemeProvider>
            <LocationProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <AppContent />
              </GestureHandlerRootView>
            </LocationProvider>
          </ThemeProvider>
        </ContextProvider>
      </UserRoleProvider>
    </ClerkProvider>
  );
}
