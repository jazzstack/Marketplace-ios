import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import LatestItems from "../components/LatestItems";
import { hp } from "../common/helper";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { UseTheme } from "../Context/ThemeContext";

const Explore = () => {
  const route = useRoute();
  const router = useRouter();
  const { Data, Searchvalue } = route.params;
  const { Theme, commonStyles, getOppositeColor, colorShades } = UseTheme();

  return (
    <View style={[styles.container, commonStyles.container]}>
      <View style={styles.searchWrapper}>
        <TouchableOpacity
          style={[styles.searchContainer, commonStyles.input]}
          onPress={() => router.push("/SearchPage")}
        >
          <AntDesign
            name="search1"
            size={24}
            color={getOppositeColor(colorShades, "jet", "white")}
            style={styles.searchIcon}
          />
          <Text
            style={[styles.searchText, commonStyles.text]}
            numberOfLines={1}
          >
            {Searchvalue || "Search"}
          </Text>
        </TouchableOpacity>
      </View>

      {Data && Data.length > 0 ? (
        <LatestItems source={Data} />
      ) : (
        <View style={styles.noResults}>
          <AntDesign
            name="search1"
            size={50}
            color={getOppositeColor(colorShades, "dimGray", "dimGray")}
          />
          <Text style={[styles.noResultsText, commonStyles.text]}>
            No items found nearby
          </Text>
          <Text
            style={[
              styles.noResultsSubtext,
              { color: getOppositeColor(colorShades, "dimGray", "dimGray") },
            ]}
          >
            Try adjusting your search or location
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: hp(2),
  },
  searchContainer: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
  },
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
  },
  noResultsSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default Explore;
