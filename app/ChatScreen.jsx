import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  StatusBar,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { supabase } from "../lib/supabase";
import { Image } from "expo-image";
import { UseTheme } from "../Context/ThemeContext";

const { width } = Dimensions.get("window");

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, isLoaded } = useUser();
  const { SellerId, item, buyerId } = route.params;
  const flatListRef = useRef(null);
  const { Theme, commonStyles, getOppositeColor, colorShades } = UseTheme();

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const currentUser = user?.fullName;
  const usermail = user?.primaryEmailAddress?.emailAddress;

  const createChatIfNotExists = async () => {
    const buyer_id = buyerId;
    const seller_id = SellerId;
    const docId = item.docId;

    if (!buyer_id || !seller_id) return;

    const ChatId =
      buyer_id < seller_id
        ? `${buyer_id}_${seller_id}_${docId}`
        : `${seller_id}_${buyer_id}_${docId}`;

    try {
      const { data: existingChat } = await supabase
        .from("chats")
        .select("id")
        .eq("id", ChatId)
        .single();

      if (!existingChat) {
        await supabase.from("chats").insert({
          id: ChatId,
          last_message: "I am interested in your product!",
          last_updated: new Date().toISOString(),
          participants: [buyer_id, seller_id],
          product_name: item.title,
          product_price: item.price,
          seller_id: seller_id,
          doc_id: item.docId,
          buyer_id: buyer_id,
          seller_name: item.seller_name,
          seller_image: item.sellerimage,
          buyer_name: currentUser,
          buyer_image: user.imageUrl,
          title: item.title,
        });

        await supabase.from("messages").insert({
          chat_id: ChatId,
          sender: usermail,
          data: `I am interested in your ${item.title}`,
          timestamp: new Date().toISOString(),
        });

        console.log("Chat and first message created.");
      } else {
        console.log("Chat already exists.");
      }
    } catch (Error) {
      console.log("Error creating chat:", Error);
    }
  };

  // Update keyboard effect to be more reliable
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        scrollToBottom();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [messages.length]);

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Fetch messages from Supabase with real-time subscription
  useEffect(() => {
    const buyer_id = buyerId;
    const seller_id = SellerId;
    const docId = item.docId;

    if (!buyer_id || !seller_id) return;

    const ChatId =
      buyer_id < seller_id
        ? `${buyer_id}_${seller_id}_${docId}`
        : `${seller_id}_${buyer_id}_${docId}`;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", ChatId)
        .order("timestamp", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data || []);
      if (flatListRef.current && data?.length > 0) {
        setTimeout(() => {
          flatListRef.current.scrollToEnd({ animated: true });
        }, 200);
      }
    };

    // Subscribe to real-time changes
    const channel = supabase.channel(`messages:${ChatId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${ChatId}`,
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    const initialLoad = async () => {
      if (isLoaded && user) {
        await createChatIfNotExists();
        await loadMessages();
      }
    };

    initialLoad();

    // Clean up the subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [isLoaded, user, SellerId]);

  const handleSendMessage = async () => {
    const buyer_id = buyerId;
    const seller_id = SellerId;
    const docId = item.docId;

    if (!buyer_id || !seller_id || !messageInput.trim()) return;

    const ChatId =
      buyer_id < seller_id
        ? `${buyer_id}_${seller_id}_${docId}`
        : `${seller_id}_${buyer_id}_${docId}`;

    await supabase.from("messages").insert({
      chat_id: ChatId,
      sender: usermail,
      data: messageInput.trim(),
      timestamp: new Date().toISOString(),
    });

    setMessageInput("");
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: Theme === "dark" ? "#1a1a1a" : "#6c47ff" },
      ]}
    >
      <StatusBar
        barStyle={Theme === "dark" ? "light-content" : "light-content"}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: Theme === "dark" ? "#1a1a1a" : "#6c47ff" },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Image
              source={{
                uri:
                  currentUser === item.seller_name
                    ? item.buyerimage
                    : item.sellerimage,
              }}
              style={styles.profileImage}
              contentFit="cover"
            />
            <View style={styles.headerInfo}>
              <Text style={styles.headerName} numberOfLines={1}>
                {currentUser === item.seller_name
                  ? item.buyer_name
                  : item.seller_name}
              </Text>
              <Text style={styles.headerProduct} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
          </View>
        </View>

        {/* Warning Banner */}
        <View
          style={[
            styles.warningBanner,
            { backgroundColor: Theme === "dark" ? "#2C3E50" : "#fff" },
          ]}
        >
          <MaterialIcons
            name="security"
            size={16}
            color={Theme === "dark" ? "#A0AEC0" : "#666"}
          />
          <Text
            style={[
              styles.warningText,
              { color: Theme === "dark" ? "#A0AEC0" : "#666" },
            ]}
          >
            Don't share sensitive information in this chat
          </Text>
        </View>

        {/* Messages List */}
        <View style={{ flex: 1, backgroundColor: Theme === "dark" ? "#121212" : "#fff" }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item, index }) => {
              const isCurrentUser = item.sender === usermail;
              const showTimestamp = true;

              return (
                <View
                  style={[
                    styles.messageContainer,
                    isCurrentUser
                      ? styles.currentUserMessage
                      : styles.otherUserMessage,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isCurrentUser
                        ? [
                            styles.currentUserBubble,
                            {
                              backgroundColor:
                                Theme === "dark" ? "#4A90E2" : "#6c47ff",
                            },
                          ]
                        : [
                            styles.otherUserBubble,
                            {
                              backgroundColor:
                                Theme === "dark" ? "#2C3E50" : "#f0f0f0",
                            },
                          ],
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        {
                          color: isCurrentUser
                            ? "#fff"
                            : Theme === "dark"
                            ? "#fff"
                            : "#2d3748",
                        },
                      ]}
                    >
                      {item.data}
                    </Text>
                    {showTimestamp && item.timestamp && (
                      <Text
                        style={[
                          styles.timestampText,
                          {
                            color: isCurrentUser
                              ? "rgba(255, 255, 255, 0.7)"
                              : Theme === "dark"
                              ? "rgba(255, 255, 255, 0.7)"
                              : "rgba(45, 55, 72, 0.7)",
                          },
                        ]}
                      >
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    )}
                  </View>
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={true}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 10,
            }}
          />
        </View>

        {/* Input Area */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: Theme === "dark" ? "#1a1a1a" : "#fff",
              borderTopColor: Theme === "dark" ? "#2C3E50" : "#edf2f7",
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: Theme === "dark" ? "#2C3E50" : "#f8f9fa",
                color: Theme === "dark" ? "#fff" : "#2d3748",
              },
            ]}
            placeholder="Type a message..."
            value={messageInput}
            onChangeText={setMessageInput}
            multiline
            maxHeight={100}
            placeholderTextColor={Theme === "dark" ? "#A0AEC0" : "#666"}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !messageInput.trim() && styles.sendButtonDisabled,
              {
                backgroundColor: messageInput.trim()
                  ? Theme === "dark"
                    ? "#4A90E2"
                    : "#6c47ff"
                  : "#E2E8F0",
              },
            ]}
            onPress={handleSendMessage}
            disabled={!messageInput.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={messageInput.trim() ? "#fff" : "#A0AEC0"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#6c47ff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#6c47ff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    height:
      Platform.OS === "android" ? 56 + (StatusBar.currentHeight || 0) : 56,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  headerName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 1,
  },
  headerProduct: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
  },
  warningText: {
    marginLeft: 6,
    color: "#666",
    fontSize: 12,
  },
  messagesList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: "80%",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    maxWidth: "100%",
  },
  currentUserBubble: {
    backgroundColor: "#6c47ff",
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: "#f0f0f0",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#fff",
  },
  timestampText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#edf2f7",
  },
  input: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
    color: "#2d3748",
  },
  sendButton: {
    backgroundColor: "#6c47ff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#E2E8F0",
  },
});

export default ChatScreen;
