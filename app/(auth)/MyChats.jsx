import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseconfig";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { UseTheme } from "../../Context/ThemeContext";

const MyChats = () => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const username = user?.primaryEmailAddress?.emailAddress;
  const db = getFirestore(app);
  const navigation = useNavigation();
  const { Theme, commonStyles, getOppositeColor, colorShades } = UseTheme();

  // Use useFocusEffect to refresh data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (isLoaded && username) {
        fetchChats();
      }
    }, [isLoaded, username])
  );

  const fetchChats = async () => {
    if (!username) return;

    try {
      const chatsRef = collection(db, "Chats");
      const q = query(
        chatsRef,
        where("participants", "array-contains", username)
      );

      // Use onSnapshot for real-time updates
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chatData = snapshot.docs.map((doc) => {
          const data = doc.data();
          const chatId = doc.id;

          // Extract the other user's email from participants array
          const otherUserEmail =
            data.participants?.find((email) => email !== username) || "";

          // Gather all necessary data for navigation
          return {
            id: chatId,
            otherUserEmail,
            lastMessage: data.lastMessage || "No messages yet",
            lastUpdated: data.lastUpdated
              ? data.lastUpdated.toDate()
              : new Date(),
            participants: data.participants || [],
            productName: data.productName || "",
            productPrice: data.productPrice || "",
            SellerId: data.SellerId || otherUserEmail,
            docId: data.docId || chatId,
            buyer_id: data.buyer_id || otherUserEmail,
            sellerName:data.seller_name,
            buyerName:data.buyer_name,
            title:data.title,
            sellerimage:data.seller_image,
            buyerimage:data.buyerimage

            // Add any other fields needed for ChatScreen
          };
        });

        // Sort chats by most recent first
        const sortedChats = chatData.sort(
          (a, b) => b.lastUpdated - a.lastUpdated
        );
        setChats(sortedChats);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error fetching chats:", error);
      setLoading(false);
    }
  };

  const navigateToChat = (item) => {
 
    // Prepare the navigation params to match the expected format in ChatScreen
    navigation.navigate("ChatScreen", {
      SellerId: item.SellerId,
      buyerId: item.buyer_id,
      item: {
        seller_name: item.sellerName,
        sellerimage:item.sellerimage,
        buyer_name: item.buyerName,
        buyerimage:item.buyerimage,
        title:item.title,
        docId: item.docId || item.id,
        name: item.productName,
        price: item.productPrice,
        userimage: "", // Add a default image or fetch from user profile
        lastMessage: item.lastMessage,
      },
    });
  };

  const getInitials = (email) => {
    if (!email) return "?";
    return email.charAt(0).toUpperCase();
  };

  // Function to format time difference
  const formatTimeAgo = (date) => {
    if (!date) return "";

    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return diffDay === 1 ? "yesterday" : `${diffDay} days ago`;
    } else if (diffHour > 0) {
      return `${diffHour} ${diffHour === 1 ? "hour" : "hours"} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`;
    } else {
      return "just now";
    }
  };

  const renderChatItem = ({ item }) => {
    const partnerEmail =
      item.participants?.find((email) => email !== username) ||
      item.otherUserEmail ||
      item.SellerId;

    return (
      <TouchableOpacity
        onPress={() => navigateToChat(item)}
        style={[styles.chatItem, commonStyles.card]}
      >
        <View
          style={[
            styles.avatar,
            { backgroundColor: Theme === "dark" ? "#4A90E2" : "#6c47ff" },
          ]}
        >
          <Text style={styles.avatarText}>{getInitials(partnerEmail)}</Text>
        </View>

        <View style={styles.chatContent}>
          <View style={styles.headerRow}>
            <Text
              style={[styles.emailText, commonStyles.text]}
              numberOfLines={1}
            >
              {partnerEmail}
            </Text>
            <Text
              style={[
                styles.timeText,
                {
                  color:
                    Theme === "dark"
                      ? colorShades.whiteShades.ghostWhite + "99"
                      : getOppositeColor(colorShades, "dimGray", "dimGray"),
                },
              ]}
            >
              {formatTimeAgo(item.lastUpdated)}
            </Text>
          </View>

          <View style={styles.messageContainer}>
            <Text
              style={[
                styles.messageText,
                {
                  color:
                    Theme === "dark"
                      ? colorShades.whiteShades.ghostWhite + "CC"
                      : getOppositeColor(colorShades, "dimGray", "dimGray"),
                },
              ]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
          </View>

          {item.productName && (
            <View
              style={[
                styles.productBadge,
                { backgroundColor: Theme === "dark" ? "#2C3E50" : "#f3f4f6" },
              ]}
            >
              <Text
                style={[
                  styles.productText,
                  {
                    color:
                      Theme === "dark"
                        ? colorShades.whiteShades.ghostWhite
                        : getOppositeColor(colorShades),
                  },
                ]}
              >
                {item.productName}{" "}
                {item.productPrice ? `- ₹${item.productPrice}` : ""}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (!isLoaded || loading) {
    return (
      <View style={[styles.loadingContainer, commonStyles.container]}>
        <ActivityIndicator size="large" color="#6c47ff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, commonStyles.container]}>
      <View
        style={[
          styles.header,
          { borderBottomColor: Theme === "dark" ? "#333" : "#e5e7eb" },
        ]}
      >
        <Text style={[styles.headerTitle, commonStyles.text]}>Messages</Text>
      </View>

      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather
            name="message-circle"
            size={60}
            color={getOppositeColor(colorShades, "dimGray", "dimGray")}
          />
          <Text style={[styles.emptyTextMain, commonStyles.text]}>
            No conversations yet
          </Text>
          <Text
            style={[
              styles.emptyTextSub,
              { color: getOppositeColor(colorShades, "dimGray", "dimGray") },
            ]}
          >
            When you start chatting with sellers or buyers, you'll see them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  chatList: {
    padding: 16,
  },
  chatItem: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  chatContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  emailText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
  },
  messageContainer: {
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
  },
  productBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  productText: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTextMain: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyTextSub: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default MyChats;
