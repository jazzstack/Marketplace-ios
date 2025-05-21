import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { hp, wp } from "../common/helper";
import { useNavigation } from "@react-navigation/native";
import { UseTheme } from "../Context/ThemeContext";

const Category = ({ source }) => {
  const navigation = useNavigation();
  const { Theme, commonStyles, getOppositeColor, colorShades } = UseTheme();

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginTop: "3.6%",
      }}
    >
      <Text
        style={[
          { marginBottom: "1%", fontWeight: 600, fontSize: 15 },
          commonStyles.text,
        ]}
      >
        Categories
      </Text>
      <FlatList
        data={source}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={{
                justifyContent: "space-around",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                width: wp(17),
              }}
              onPress={() =>
                navigation.navigate("CategoryPage", { category: item })
              }
            >
              <View
                style={{
                  padding: 5,
                  borderRadius: 100,
                  backgroundColor: Theme === "dark" ? "#2C3E50" : "#f5f5f5",
                }}
              >
                <Image
                  source={{ uri: item.Image }}
                  style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Category;
