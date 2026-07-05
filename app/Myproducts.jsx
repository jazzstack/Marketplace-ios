import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import ProductCard from "../components/Card";
import EditModal from "../components/Modal/EditModal";

const Myproducts = () => {
  const [MyProducts, SetMyProducts] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [Data, setData] = useState({});
  const { user } = useUser();

  const handleEdit = (item) => {
    setData({
      desc: item.description,
      name: item.title,
      price: item.price,
      docId: item.id,
    });
    setModalVisible(true);
  };

  const handleSubmit = async (item) => {
    Alert.alert(
      "Update Post",
      "Are you sure you want to save the changes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("user_posts")
                .update({
                  name: Data.name,
                  description: Data.desc,
                  price: Data.price,
                })
                .eq("id", Data.docId);

              if (error) throw error;

              console.log("Document successfully updated!");
              setModalVisible(false);
              setData({});
              GetPostsData();
            } catch (error) {
              console.error("Error updating document: ", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const GetPostsData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_posts")
        .select("*")
        .eq("useremail", user.primaryEmailAddress.emailAddress);

      if (error) throw error;

      SetMyProducts(data || []);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching Posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    GetPostsData();
  }, []);

  const handledelete = async (item) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error: deleteError } = await supabase
                .from("user_posts")
                .delete()
                .eq("id", item.id);

              if (deleteError) throw deleteError;

              // Delete the image from storage
              if (item.image) {
                const imagePath = extractStoragePath(item.image);
                if (imagePath) {
                  await supabase.storage
                    .from("community-posts")
                    .remove([imagePath]);
                }
              }

              GetPostsData();
              console.log("Post and image deleted");
            } catch (error) {
              console.error("Error deleting post or image:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const extractStoragePath = (url) => {
    // Supabase public URL format: .../object/public/community-posts/path
    const match = url.match(/\/community-posts\/(.+)$/);
    return match ? match[1] : null;
  };

  const CheckOwner = (email) => {
    return user?.primaryEmailAddress?.emailAddress === email;
  };

  return (
    <View>
      {Loading ? (
        <View
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            numColumns={2}
            data={MyProducts}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View>
                <ProductCard
                  imageUrl={item.image}
                  name={item.title}
                  price={item.price}
                  condition={CheckOwner(item.useremail)}
                  Ondelete={() => handledelete(item)}
                  onEdit={() => handleEdit(item)}
                />
                <EditModal
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                  item={Data}
                  setitem={setData}
                  onsubmit={() => handleSubmit(item)}
                />
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Myproducts;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
