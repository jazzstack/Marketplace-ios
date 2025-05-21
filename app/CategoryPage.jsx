import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../Context/DataContext";
import { useLocation } from "../Context/LocationContext";
import ProductCard from "../components/Card";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { UseTheme } from "../Context/ThemeContext";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = 80; // Fixed width for sidebar

const CategoryPage = () => {
  const navigation = useNavigation();
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { Theme, commonStyles, getOppositeColor, colorShades } = UseTheme();

  const route = useRoute();
  const { category } = route.params;
  const { Posts, GetPostsData, Categories } = useAuth();
  const { location, getCurrentLocation } = useLocation();

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
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

  useEffect(() => {
    navigation.setOptions({
      title: category.Name,
      headerStyle: {
        backgroundColor: Theme === "dark" ? "#1a1a1a" : "#6c47ff",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "white",
      },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [Theme]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([GetPostsData(), getCurrentLocation()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (Posts.length > 0 && location) {
      const postsInCategory = Posts.filter(
        (item) => item.category === category.Name
      );

      // Filter posts by location (within 50km)
      const nearbyPosts = postsInCategory.filter((post) => {
        if (
          !post.location ||
          !post.location.latitude ||
          !post.location.longitude
        )
          return false;

        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          post.location.latitude,
          post.location.longitude
        );

        return distance <= 50;
      });

      setFilteredPosts(nearbyPosts);
    } else {
      setFilteredPosts(Posts.filter((item) => item.category === category.Name));
    }
  }, [Posts, location, category]);

  const renderCategoryItem = ({ item }) => {
    const isSelected = item.Name === category.Name;
    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          { backgroundColor: Theme === "dark" ? "#2C3E50" : "#fff" },
          isSelected && [
            styles.selectedCategory,
            { backgroundColor: Theme === "dark" ? "#4A90E2" : "#6c47ff" },
          ],
        ]}
        onPress={() => navigation.setParams({ category: item })}
      >
        <View
          style={[
            styles.categoryImageContainer,
            { backgroundColor: Theme === "dark" ? "#1a1a1a" : "#f5f5f5" },
          ]}
        >
          <Image
            source={{ uri: item.Image }}
            style={[
              styles.categoryImage,
              isSelected && styles.selectedCategoryImage,
            ]}
          />
        </View>
        <Text
          style={[
            styles.categoryText,
            {
              color:
                Theme === "dark" ? colorShades.whiteShades.ghostWhite : "#333",
            },
            isSelected && [styles.selectedCategoryText, { color: "#fff" }],
          ]}
          numberOfLines={1}
        >
          {item.Name}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: Theme === "dark" ? "#121212" : "#fff" },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={Theme === "dark" ? "#4A90E2" : "#6c47ff"}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Theme === "dark" ? "#121212" : "#fff" },
      ]}
    >
      {/* Static Sidebar */}
      <View
        style={[
          styles.sidebar,
          { backgroundColor: Theme === "dark" ? "#1a1a1a" : "#f5f5f5" },
        ]}
      >
        <FlatList
          data={Categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.Name}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sidebarContent}
        />
      </View>

      {/* Main Content */}
      <View
        style={[
          styles.mainContent,
          { backgroundColor: Theme === "dark" ? "#121212" : "#fff" },
        ]}
      >
        <FlatList
          numColumns={2}
          data={filteredPosts}
          renderItem={({ item }) => (
            <ProductCard
              imageUrl={item.image}
              name={item.name}
              price={item.price}
              action={() => navigation.navigate("productDetails", { item })}
            />
          )}
          ListEmptyComponent={() => (
            <View
              style={[
                styles.emptyContainer,
                { backgroundColor: Theme === "dark" ? "#121212" : "#fff" },
              ]}
            >
              <MaterialIcons
                name="location-off"
                size={48}
                color={
                  Theme === "dark"
                    ? colorShades.whiteShades.ghostWhite + "99"
                    : "#666"
                }
              />
              <Text
                style={[
                  styles.emptyText,
                  {
                    color:
                      Theme === "dark"
                        ? colorShades.whiteShades.ghostWhite + "99"
                        : "#666",
                  },
                ]}
              >
                No items found in this category near you
              </Text>
            </View>
          )}
          contentContainerStyle={
            filteredPosts.length === 0 ? { flex: 1 } : styles.listContainer
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    borderRightWidth: 1,
    borderRightColor: "#eee",
  },
  sidebarContent: {
    paddingVertical: 10,
  },
  categoryItem: {
    alignItems: "center",
    padding: 10,
    marginBottom: 5,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  selectedCategory: {
    elevation: 2,
  },
  categoryImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  categoryImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  selectedCategoryImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  categoryText: {
    fontSize: 10,
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
  },
  listContainer: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
  },
  headerButton: {
    marginLeft: 10,
  },
});

export default CategoryPage;
