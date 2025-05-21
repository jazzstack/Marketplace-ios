import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useRouter } from "expo-router";

const INdex = () => {
  const router = useRouter();
  const [isadmin, setisadmin] = useState(true);
  useEffect(() => {
    if (isadmin === false) {
      Alert.alert(`You will be kicked out in 5 seconds`);
      setTimeout(() => {
        router.replace("./(public)/Welcome");
      }, 5000);
    }
  }, [isadmin < 1]);
  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <Text>Choose one of the options</Text>
      <View style={{ flexDirection: "row", padding: 10 }}>
        <TouchableOpacity
          style={{
            marginHorizontal: 10,
            backgroundColor: "lightgreen",
            padding: 10,
          }}
          onPress={() => {
            Alert.alert(
              "Sorry Admins powers are still Loading!! Try again after some time"
            );
          }}
        >
          <Text>I am Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginHorizontal: 10,
            backgroundColor: "red",
            padding: 10,
          }}
          onPress={() => setisadmin(false)}
        >
          <Text>I am not Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default INdex;
