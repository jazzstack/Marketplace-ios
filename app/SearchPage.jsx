import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hp, wp } from "../common/helper";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../Context/DataContext";
import { useLocation } from "../Context/LocationContext";
import Category from "../components/Categories";
import { useNavigation } from "expo-router";
import { UseTheme } from "../Context/ThemeContext";

const SEARCH_HISTORY_KEY = "@search_history";
const MAX_HISTORY_ITEMS = 5;
const MAX_DISTANCE = 50; // 50km radius

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { Categories, Posts } = useAuth();
  const { location, getCurrentLocation } = useLocation();
  const { Theme, commonStyles, getOppositeColor, colorShades } = UseTheme();

  useEffect(() => {
    loadSearchHistory();
    getCurrentLocation();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error("Error loading search history:", error);
    }
  };

  const saveSearchHistory = async (query) => {
    try {
      let history = [...searchHistory];
      history = history.filter((item) => item !== query);
      history.unshift(query);
      history = history.slice(0, MAX_HISTORY_ITEMS);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
      setSearchHistory(history);
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  };

  const clearSearchHistory = async () => {
    try {
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
      setSearchHistory([]);
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value) => {
    return (value * Math.PI) / 180;
  };

  const handleSearch = async (query) => {
    setIsLoading(true);

    if (query.trim()) {
      await saveSearchHistory(query);
    }

    if (!location) {
      await getCurrentLocation();
    }

    const filtered = Posts.filter((item) => {
      // First check if the item matches the search query
      const matchesQuery =
        item.desc?.toLowerCase().includes(query.toLowerCase()) ||
        item.name?.toLowerCase().includes(query.toLowerCase());

      if (!matchesQuery) return false;

      // Then check if the item has valid location data
      if (!item.location?.latitude || !item.location?.longitude) {
        return false;
      }

      // If we have user's location, filter by distance
      if (location) {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          item.location.latitude,
          item.location.longitude
        );
        return distance <= MAX_DISTANCE;
      }

      return false; // If no location available, don't show the item
    });

    setFilteredPosts(filtered);
    setIsLoading(false);

    navigation.navigate("explore", {
      Data: filtered,
      Searchvalue: query,
    });
  };

  const renderSearchHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => {
        setSearchQuery(item);
        handleSearch(item);
      }}
    >
      <AntDesign name="clockcircleo" size={16} color="#666" />
      <Text style={styles.historyText}>{item}</Text>
      <TouchableOpacity
        onPress={() => {
          const newHistory = searchHistory.filter((h) => h !== item);
          setSearchHistory(newHistory);
          AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
        }}
        style={styles.removeButton}
      >
        <AntDesign name="close" size={16} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, commonStyles.container]}
      showsVerticalScrollIndicator={false}
    >
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, commonStyles.input]}>
          <AntDesign
            name="search1"
            size={24}
            color={getOppositeColor(colorShades, "jet", "white")}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: getOppositeColor(colorShades) },
            ]}
            placeholder={
              location
                ? "Search items within 50km..."
                : "Getting your location..."
            }
            placeholderTextColor={getOppositeColor(
              colorShades,
              "dimGray",
              "dimGray"
            )}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <AntDesign
                name="close"
                size={20}
                color={getOppositeColor(colorShades, "jet", "white")}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Location Status */}
      {!location && (
        <View
          style={[
            styles.locationStatus,
            {
              backgroundColor:
                Theme === "dark" ? colorShades.blackShades.jet : "#f0f9ff",
            },
          ]}
        >
          <ActivityIndicator size="small" color="#6c47ff" />
          <Text style={[styles.locationText, commonStyles.text]}>
            Getting your location...
          </Text>
        </View>
      )}

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={[styles.sectionTitle, commonStyles.text]}>
          Browse Categories
        </Text>
        <Category source={Categories} />
      </View>

      {/* Recent Searches */}
      {searchHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={[styles.sectionTitle, commonStyles.text]}>
              Recent Searches
            </Text>
            <TouchableOpacity onPress={clearSearchHistory}>
              <Text style={styles.clearHistoryText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={searchHistory}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.historyItem, commonStyles.card]}
                onPress={() => {
                  setSearchQuery(item);
                  handleSearch(item);
                }}
              >
                <AntDesign
                  name="clockcircleo"
                  size={16}
                  color={getOppositeColor(colorShades, "jet", "white")}
                />
                <Text style={[styles.historyText, commonStyles.text]}>
                  {item}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const newHistory = searchHistory.filter((h) => h !== item);
                    setSearchHistory(newHistory);
                    AsyncStorage.setItem(
                      SEARCH_HISTORY_KEY,
                      JSON.stringify(newHistory)
                    );
                  }}
                  style={styles.removeButton}
                >
                  <AntDesign
                    name="close"
                    size={16}
                    color={getOppositeColor(colorShades, "jet", "white")}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: hp(2),
  },
  searchInputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  categoriesContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  historyContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  clearHistoryText: {
    color: "#6c47ff",
    fontSize: 14,
    fontWeight: "500",
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
  },
  removeButton: {
    padding: 5,
  },
  locationStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default SearchPage;
