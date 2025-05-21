import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Feather, Ionicons } from "@expo/vector-icons";
import { UseTheme } from "../Context/ThemeContext";
import ImageView from "react-native-image-viewing";

const ProductDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const { user, isLoaded } = useUser();
  const { Theme, commonStyles, getOppositeColor, colorShades } = UseTheme();
  const [Visible, SetVisible] = useState(false);

  // State to store share message and loading state
  const [shareMessage, setShareMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate the share message when the component mounts
  useEffect(() => {
    const msg = `Take a look at this amazing product ${item.name} I found at Havensmart: ${item.desc}`;
    setShareMessage(msg);
  }, []);

  // Share function triggered when the share button is clicked
  const Customshare = async () => {
    if (!shareMessage.trim()) {
      alert("Message not ready to share.");
      return;
    }

    try {
      setLoading(true);
      await Share.share({ message: shareMessage });
    } catch (error) {
      alert("Something went wrong while sharing.");
      console.error("Error sharing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = () => {
    Alert.alert(
      "Start Chat",
      "Are you sure that you want to chat with this seller?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("ChatScreen", {
              SellerId: item.useremail,
              item: item,
              buyerId: user.primaryEmailAddress?.emailAddress,
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: Theme === "dark" ? "#121212" : "#fff" },
      ]}
    >
      <View>
        <ImageView
          images={[{ uri: item.image }]}
          imageIndex={0}
          visible={Visible}
          animationType="slide"
          onRequestClose={() => SetVisible(false)}
        />
        <TouchableOpacity onPress={() => SetVisible(true)}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </TouchableOpacity>
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: Theme === "dark" ? "#2C3E50" : "white",
            padding: 5,
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity onPress={Customshare} disabled={loading}>
            <Feather
              name="share-2"
              size={24}
              color={
                Theme === "dark" ? colorShades.whiteShades.ghostWhite : "black"
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[
          styles.content,
          { backgroundColor: Theme === "dark" ? "#121212" : "#fff" },
        ]}
      >
        <View style={styles.header}>
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
            {item.title}
          </Text>
          <Text
            style={[
              styles.price,
              { color: Theme === "dark" ? "#4A90E2" : "#6c47ff" },
            ]}
          >
            ₹{item.price}
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color:
                  Theme === "dark"
                    ? colorShades.whiteShades.ghostWhite
                    : "#333",
              },
            ]}
          >
            Description
          </Text>
          <Text
            style={[
              styles.description,
              {
                color:
                  Theme === "dark"
                    ? colorShades.whiteShades.ghostWhite + "CC"
                    : "#666",
              },
            ]}
          >
            {item.desc}
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color:
                  Theme === "dark"
                    ? colorShades.whiteShades.ghostWhite
                    : "#333",
              },
            ]}
          >
            Seller Information
          </Text>
          <Text
            style={[
              styles.sellerName,
              {
                color:
                  Theme === "dark"
                    ? colorShades.whiteShades.ghostWhite
                    : "#000",
              },
            ]}
          >
            {item.username}
          </Text>
          <View style={styles.locationContainer}>
            <Ionicons
              name="location"
              size={16}
              color={
                Theme === "dark"
                  ? colorShades.whiteShades.ghostWhite + "99"
                  : "#666"
              }
            />
            <Text
              style={[
                styles.location,
                {
                  color:
                    Theme === "dark"
                      ? colorShades.whiteShades.ghostWhite + "99"
                      : "#666",
                },
              ]}
            >
              {item.address}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.contactButton,
            { backgroundColor: Theme === "dark" ? "#4A90E2" : "#6c47ff" },
          ]}
          onPress={handleContactSeller}
        >
          <Text style={styles.contactButtonText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 16,
    marginLeft: 4,
  },
  contactButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductDetails;
