import { View, ActivityIndicator } from "react-native";
import React from "react";

const Index = () => {
  return (
    // This page is only used to show a loading indicator when the app is loading
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};
export default Index;