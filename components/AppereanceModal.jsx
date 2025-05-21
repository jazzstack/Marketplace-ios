import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { UseTheme } from "../Context/ThemeContext";

const AppereanceModal = ({ Visible, Setvisible, content }) => {
  const { Theme, getOppositeColor, colorShades, getSameColor } = UseTheme();
  return (
    <View>
      <Modal
        visible={Visible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => Setvisible(false)}
      >
        <View style={styles.overlay}>
          <View
            style={[
              styles.content,
              { backgroundColor: Theme == "dark" ? "black" : "white" },
            ]}
          >
            <TouchableOpacity
              style={{ position: "absolute", top: 5, right: 5 }}
              onPress={() => Setvisible(false)}
            >
              <Entypo
                name="cross"
                size={24}
                color={getOppositeColor(colorShades, "jet", "white")}
              />
            </TouchableOpacity>
            {content}
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Added transparency for better visibility
  },
  content: {
    width: "50%", // or adjust to your liking
    padding: 20,
    borderRadius: 12,
    // elevation: 5, // Android shadow
    // shadowColor: "#000", // iOS shadow
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
  },
});

export default AppereanceModal;
