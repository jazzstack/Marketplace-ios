import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Pressable,
} from "react-native";
import { UseTheme } from "../Context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

const ThemeBottomSheet = ({
  isVisible,
  onClose,
  selectedId,
  setSelectedId,
}) => {
  const { Theme, colorShades, getOppositeColor } = UseTheme();

  const handleOptionPress = (optionId) => {
    setSelectedId(optionId);
    onClose();
  };

  const themeOptions = [
    {
      id: "dark",
      label: "Dark Mode",
      icon: "moon",
      description: "Easy on the eyes in low light",
    },
    {
      id: "light",
      label: "Light Mode",
      icon: "sunny",
      description: "Classic bright display",
    },
    {
      id: "system",
      label: "System Default",
      icon: "phone-portrait",
      description: "Follows your device settings",
    },
  ];

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.contentContainer,
            {
              backgroundColor: Theme === "dark" ? "#1a1a1a" : "#fff",
            },
          ]}
        >
          <View style={styles.handle} />
          <Text
            style={[
              styles.title,
              {
                color:
                  Theme === "dark"
                    ? colorShades.whiteShades.ghostWhite
                    : "#000",
              },
            ]}
          >
            Choose Theme
          </Text>

          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionContainer,
                selectedId === option.id && {
                  backgroundColor: Theme === "dark" ? "#2C3E50" : "#f0f0f0",
                },
              ]}
              onPress={() => handleOptionPress(option.id)}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor:
                        Theme === "dark"
                          ? selectedId === option.id
                            ? "#4A90E2"
                            : "#2C3E50"
                          : selectedId === option.id
                          ? "#6c47ff"
                          : "#f5f5f5",
                    },
                  ]}
                >
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={
                      selectedId === option.id
                        ? "#fff"
                        : getOppositeColor(colorShades, "jet", "white")
                    }
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.optionTitle,
                      {
                        color:
                          Theme === "dark"
                            ? colorShades.whiteShades.ghostWhite
                            : "#000",
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      {
                        color:
                          Theme === "dark"
                            ? colorShades.whiteShades.ghostWhite + "99"
                            : "#666",
                      },
                    ]}
                  >
                    {option.description}
                  </Text>
                </View>
              </View>
              {selectedId === option.id && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={Theme === "dark" ? "#4A90E2" : "#6c47ff"}
                />
              )}
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  contentContainer: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#999",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    justifyContent: "space-between",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
});

export default ThemeBottomSheet;
