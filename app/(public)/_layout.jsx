import React from "react";
import { Stack } from "expo-router";
import { UseTheme } from "../../Context/ThemeContext";

const PublicLayout = () => {
  const { Theme, colorShades } = UseTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor:
            Theme === "dark" ? colorShades.blackShades.jet : "#6E75F4",
        },
        headerTintColor:
          Theme === "dark" ? colorShades.whiteShades.white : "#fff",
      }}
    >
      <Stack.Screen
        name="welcome"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerTitle: "Login",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerTitle: "Create Account",
        }}
      />
      <Stack.Screen
        name="reset"
        options={{
          headerTitle: "Reset Password",
        }}
      />
    </Stack>
  );
};

export default PublicLayout;
