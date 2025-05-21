import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { hp, wp } from "../common/helper";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { EvilIcons, FontAwesome5 } from "@expo/vector-icons";
import { UseTheme } from "../Context/ThemeContext";

const ProductCard = ({
  name,
  price,
  imageUrl,
  action,
  condition,
  Ondelete,
  onEdit,
}) => {
  const Wrapper = condition ? View : TouchableOpacity;
  const { Theme, commonStyles, getOppositeColor, colorShades } = UseTheme();

  return (
    <Wrapper
      style={[
        styles.card,
        {
          backgroundColor: Theme === "dark" ? "#2C3E50" : "white",
          shadowColor: Theme === "dark" ? "#000" : "#000",
        },
      ]}
      onPress={action}
    >
      {/* Product Image */}
      <View
        style={[
          styles.imageContainer,
          { backgroundColor: Theme === "dark" ? "#1a1a1a" : "#f9f9f9" },
        ]}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {condition ? (
          <View
            style={{
              maxWidth: "150",
              maxHeight: "100",
              borderRadius: 100,
              position: "absolute",
              right: 9,
              top: 5,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: Theme === "dark" ? "#1a1a1a" : "white",
                padding: 2,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 100,
              }}
              onPress={Ondelete}
            >
              <MaterialIcons name="delete" size={19} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: Theme === "dark" ? "#1a1a1a" : "white",
                padding: 2,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 100,
              }}
              onPress={onEdit}
            >
              <FontAwesome5
                name="pencil-alt"
                size={15}
                color={
                  Theme === "dark"
                    ? colorShades.whiteShades.ghostWhite
                    : "black"
                }
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.name,
            {
              color:
                Theme === "dark" ? colorShades.whiteShades.ghostWhite : "#333",
            },
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={[
            styles.price,
            { color: Theme === "dark" ? "#4CAF50" : "#2E8B57" },
          ]}
        >
          ₹{price}
        </Text>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
    overflow: "hidden",
    width: wp(43),
  },
  imageContainer: {
    height: hp(15),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductCard;
