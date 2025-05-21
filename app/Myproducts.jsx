import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { app } from "../firebaseconfig";
import { useUser } from "@clerk/clerk-expo";
import ProductCard from "../components/Card";
import EditModal from "../components/Modal/EditModal";

const Myproducts = () => {
  const [MyProducts, SetMyProducts] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [Data, setData] = useState({});
  const db = getFirestore(app);
  const { user } = useUser();

  const handleEdit = (item) => {
    setData({
      desc: item.desc,
      name: item.title,
      price: item.price,
    });
    setModalVisible(true);
    return Data;
  };

  const handleSubmit = async (item) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to save the changes ?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          style: "destructive",
          onPress: async () => {
            try {
              const docRef = doc(db, "UserPosts", item.docId);
              await updateDoc(docRef, {
                name: Data.name,
                desc: Data.desc,
                price: Data.price,
              });
              console.log("Document successfully updated!");
              setModalVisible(false);
              GetPostsData(); // refresh the list
            } catch (error) {
              console.error("Error updating document: ", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getPathFromURL = (url) => {
    const decodedUrl = decodeURIComponent(url);
    const match = decodedUrl.match(/\/o\/(.*?)\?/);
    return match ? match[1] : null;
  };

  const GetPostsData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "UserPosts"));
      const data = querySnapshot.docs
        .map((docSnap) => ({
          ...docSnap.data(),
          docId: docSnap.id, // ✅ include the document ID
        }))
        .filter(
          (item) => item.useremail === user.primaryEmailAddress.emailAddress
        );

      SetMyProducts(data);
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
              // Delete Firestore document
              const docRef = doc(db, "UserPosts", item.docId);
              await deleteDoc(docRef);

              // Delete the image from storage
              const imagePath = getPathFromURL(item.image);
              if (imagePath) {
                const storage = getStorage();
                const imageRef = ref(storage, imagePath);
                await deleteObject(imageRef);
              }

              // Refresh data
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
            keyExtractor={(item) => item.customId}
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
