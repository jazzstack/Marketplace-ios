import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { router } from "expo-router";
import Loginscreen from "@/components/Loginscreen";
import { UseTheme } from "../../Context/ThemeContext";

const Welcome = () => {
  const { Theme, commonStyles, colorShades } = UseTheme();

  return (
    // Main container with full screen dimensions and relative positioning
    <View style={[styles.container, commonStyles.container]}>
      {/* Set relative positioning here */}
      {/* Hero image section taking up 52% of the screen height */}
      <Image
        source={require("../../assets/images/login.jpg")}
        style={styles.heroImage}
      />
      {/* White overlay container positioned at bottom half of screen */}
      <View
        style={[
          styles.overlay,
          {
            backgroundColor:
              Theme === "dark" ? colorShades.blackShades.jet : "#fff",
          },
        ]}
      >
        {/* Welcome text header section */}
        <View style={styles.headerContainer}>
          <Text style={[styles.headerText, commonStyles.text]}>
            Welcome to HavenMart!
          </Text>
        </View>

        {/* Description text section */}
        <View style={styles.descriptionContainer}>
          <View style={styles.descriptionTextContainer}>
            <Text
              style={[
                styles.descriptionText,
                {
                  color:
                    Theme === "dark"
                      ? colorShades.whiteShades.ghostWhite
                      : "#666",
                },
              ]}
            >
              Buy and sell with ease, connecting with trusted buyers and
              sellers. Discover amazing deals across various categories.
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.signupButton,
              { backgroundColor: Theme === "dark" ? "#4A90E2" : "#6E75F4" },
            ]}
            activeOpacity={0.5}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.signupButtonText}>Sign-up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.signinButton,
              {
                backgroundColor: Theme === "dark" ? "transparent" : "#fff",
                borderColor:
                  Theme === "dark"
                    ? colorShades.whiteShades.ghostWhite
                    : "#6E75F4",
              },
            ]}
            activeOpacity={0.5}
            onPress={() => router.push("/login")}
          >
            <Text
              style={[
                styles.signinButtonText,
                {
                  color:
                    Theme === "dark"
                      ? colorShades.whiteShades.ghostWhite
                      : "#6E75F4",
                },
              ]}
            >
              Sign in
            </Text>
          </TouchableOpacity>

          <View style={styles.spacer}></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "52%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  descriptionContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  descriptionTextContainer: {
    width: "90%",
  },
  descriptionText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  signupButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  signinButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  signinButtonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  spacer: {
    height: 20,
  },
});

export default Welcome;
