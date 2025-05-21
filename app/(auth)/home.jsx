import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import ProfileHeader from "../../components/ProfileHeader";
import Slider from "../../components/Slider";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../firebaseconfig";
import Category from "../../components/Categories";
import LatestItems from "../../components/LatestItems";
import { useAuth } from "../../Context/DataContext";
import { useLocation } from "../../Context/LocationContext";
import { UseTheme } from "../../Context/ThemeContext";
import ProductCard from "../../components/Card";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Home = () => {
  const { Posts, GetPostsData, GetCategoryData, Categories } = useAuth();
  const { getCurrentLocation, location, address } = useLocation();
  const { Theme, commonStyles, getOppositeColor, colorShades } = UseTheme();
  const navigation = useNavigation();
  const db = getFirestore(app);

  const [Slider_Img, SetSlider_Img] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getsliderimage = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Sliders"));
      const Slider = querySnapshot.docs.map((doc) => doc.data());
      SetSlider_Img(Slider);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        getsliderimage(),
        GetCategoryData(),
        GetPostsData(),
        getCurrentLocation(),
      ]);
    } catch (error) {
      console.error("Error refreshing:", error);
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    getsliderimage();
    GetCategoryData();
    GetPostsData();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (Posts.length > 0 && location) {
      const filteredByLocation = Posts.filter((post) => {
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

      setFilteredPosts(filteredByLocation);
    } else {
      setFilteredPosts(Posts);
    }
  }, [Posts, location]);

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
    if (Categories.length < 0 && Slider_Img.length < 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [Categories]);

  const ListHeader = () => (
    <>
      <ProfileHeader />
      {address && (
        <View style={[styles.locationContainer, commonStyles.card]}>
          <Text style={[styles.locationText, commonStyles.text]}>
            📍 Showing items near {address.city}, {address.region}
          </Text>
        </View>
      )}
      <View style={styles.sliderContainer}>
        <Slider source={Slider_Img} />
      </View>
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, commonStyles.text]}>
          Browse Categories
        </Text>
        <Category source={Categories} />
      </View>
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, commonStyles.text]}>
          Latest Items Near You
        </Text>
      </View>
    </>
  );

  if (Loading) {
    return (
      <View style={[styles.loadingContainer, commonStyles.container]}>
        <ActivityIndicator size="large" color="#6c47ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, commonStyles.container]}>
      <FlatList
        data={filteredPosts}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => (
          <ProductCard
            imageUrl={item.image}
            name={item.title}
            price={item.price}
            action={() => navigation.navigate("productDetails", { item })}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={getOppositeColor(colorShades)}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  locationContainer: {
    padding: 12,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sliderContainer: {
    marginVertical: 10,
  },
  sectionContainer: {
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
});

export default Home;
