import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { hp, wp } from "../common/helper";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { UseTheme } from "../Context/ThemeContext";
import { useRouter } from "expo-router";

const ProfileHeader = ({ posts, setFilteredPosts }) => {
  const { user } = useUser();
  const navigation = useNavigation();
  const { Theme, commonStyles, getOppositeColor, colorShades } = UseTheme();
  const router = useRouter();
  return (
    <View>
      {/* Header User Info Section */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "transparent",
          alignItems: "center",
          marginTop: hp(2),
        }}
      >
        <TouchableOpacity
          style={{ backgroundColor: "transparent", marginLeft: 10 }}
          onPress={() => {
            router.push("/Profile");
          }}
        >
          <Image
            source={{ uri: user?.imageUrl }}
            style={{
              height: hp(4),
              width: hp(4),
              borderRadius: 100,
            }}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: 10 }}>
          <Text
            style={[{ fontWeight: "600", fontSize: 15 }, commonStyles.text]}
          >
            Welcome
          </Text>
          <Text
            style={[{ fontWeight: "600", fontSize: 15 }, commonStyles.text]}
          >
            {user?.fullName}
          </Text>
        </View>
      </View>

      {/* Search Button Section */}
      <View style={{ width: "100%", alignItems: "center" }}>
        <View
          style={{
            width: "85%",
            borderWidth: 1,
            borderColor:
              Theme === "dark"
                ? colorShades.whiteShades.ghostWhite + "40"
                : "#000",
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            marginTop: hp(2),
            backgroundColor: Theme === "dark" ? colorShades.whiteShades.jet : "#fff",
          }}
        >
          <AntDesign
            name="search1"
            size={24}
            color={
              Theme === "dark" ? colorShades.whiteShades.ghostWhite : "black"
            }
            style={{ marginRight: 8 }}
          />
          <TouchableOpacity
            style={{ flex: 1, padding: 10 }}
            onPress={() => {
              navigation.navigate("SearchPage");
            }}
          >
            <Text
              style={{
                color:
                  Theme === "dark"
                    ? colorShades.whiteShades.ghostWhite + "80"
                    : "#888",
              }}
            >
              Search
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;
