import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { hp } from "../../common/helper";
import { UseTheme } from "../../Context/ThemeContext";
import ProfileCards from "../../components/ProfileCards";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import ThemeBottomSheet from "../../components/ThemeBottomSheet";

const Profile = () => {
  const { user } = useUser();
  const [selectedId, setSelectedId] = useState("system");
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const router = useRouter();
  const {
    Theme,
    SetTheme,
    SetLightTheme,
    SetdarkTheme,
    Pref,
    getOppositeColor,
    colorShades,
  } = UseTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Theme === "dark" ? "#121212" : "#fff",
    },
    header: {
      alignItems: "center",
      padding: 20,
      backgroundColor: Theme === "dark" ? "#121212" : "white",
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 5,
      color: Theme === "dark" ? colorShades.whiteShades.ghostWhite : "#000",
    },
    email: {
      fontSize: 16,
      color:
        Theme === "dark" ? colorShades.whiteShades.ghostWhite + "99" : "#666",
    },
  });

  const redir = (value) => {
    router.push(value);
  };

  useEffect(() => {
    if (selectedId === "dark") {
      SetdarkTheme();
    } else if (selectedId === "light") {
      SetLightTheme();
    } else if (selectedId === "system") {
      SetTheme(Pref);
    }
  }, [selectedId, Pref]);

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <View style={styles.header}>
          <Image
            source={{ uri: user?.imageUrl }}
            style={{
              height: hp(11),
              width: hp(11),
              borderRadius: 100,
            }}
          />
        </View>
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.email}>{user?.emailAddresses[0].emailAddress}</Text>
      </View>

      <ProfileCards
        icons={
          <Ionicons
            name="settings-sharp"
            size={20}
            color={getOppositeColor(colorShades, "jet", "white")}
          />
        }
        text={"Preferences"}
        action={() => setIsBottomSheetVisible(true)}
      />
      <ProfileCards
        icons={
          <Entypo
            name="list"
            size={20}
            color={getOppositeColor(colorShades, "jet", "white")}
          />
        }
        text={"My Listings"}
        action={() => redir("/Myproducts")}
      />
      <ProfileCards
        icons={
          <Entypo
            name="chat"
            size={24}
            color={getOppositeColor(colorShades, "jet", "white")}
          />
        }
        text={"My Chats"}
        action={() => redir("/MyChats")}
      />

      <ThemeBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </View>
  );
};

export default Profile;
