import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { UseTheme } from "../Context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const ProfileCards = ({ icons, text, action }) => {
  const { Theme, getOppositeColor, colorShades, getSameColor } = UseTheme();

  return (
    <TouchableOpacity
      onPress={action}
      style={{
        backgroundColor: getSameColor(colorShades),
        paddingVertical: "3%",
        borderWidth: 1,
        borderColor: getOppositeColor(colorShades, "jet", "white"),
        borderRadius: 15,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: "3%",
      }}
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        {icons}
        <Text
          style={{
            color: getOppositeColor(colorShades, "jet", "white"),
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {text}
        </Text>
      </View>
      <TouchableOpacity style={{}} onPress={action}>
        <Ionicons
          name="arrow-forward-circle-outline"
          size={23}
          color={getOppositeColor(colorShades, "jet", "white")}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ProfileCards;

const styles = StyleSheet.create({});
