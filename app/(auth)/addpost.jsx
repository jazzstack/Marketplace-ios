import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useUser } from "@clerk/clerk-expo";
import { useLocation } from "../../Context/LocationContext";
import { MaterialIcons } from "@expo/vector-icons";
import { UseTheme } from "../../Context/ThemeContext";

const { width } = Dimensions.get("window");

const Add = () => {
  const { user } = useUser();
  const { location, address, getCurrentLocation } = useLocation();
  const { Theme, commonStyles, getOppositeColor, colorShades } = UseTheme();

  const [categorylist, setCategoryList] = useState([]);
  const [Loading, SetLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    getCategoryList();
    if (!location) {
      getCurrentLocation();
    }
  }, []);

  const getCategoryList = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      setCategoryList(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const image_submit = async (value) => {
    SetLoading(true);
    if (!image) {
      SetLoading(false);
      Alert.alert("Error", "Image is required");
      return;
    }

    try {
      const response = await fetch(image);
      const image_blob = await response.blob();
      const fileName = "CommunityPost/" + Date.now() + ".jpg";

      const { error: uploadError } = await supabase.storage
        .from("community-posts")
        .upload(fileName, image_blob);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("community-posts")
        .getPublicUrl(fileName);

      const downloadUrl = urlData.publicUrl;

      const postData = {
        title: value.title,
        name: value.name,
        description: value.desc,
        category: value.category,
        price: value.price,
        address: value.address,
        image: downloadUrl,
        useremail: user.primaryEmailAddress.emailAddress,
        username: user.fullName,
        userimage: user.imageUrl,
        custom_id: Date.now().toString(),
      };

      if (location) {
        postData.latitude = location.latitude;
        postData.longitude = location.longitude;
      }
      if (address) {
        postData.formatted_address = address.formattedAddress;
        postData.city = address.city;
        postData.region = address.region;
      }

      const { error: insertError } = await supabase
        .from("user_posts")
        .insert(postData);

      if (insertError) throw insertError;

      SetLoading(false);
      Alert.alert("Post Data Uploaded Successfully");
      setImage(null);
    } catch (error) {
      console.error("Error:", error);
      SetLoading(false);
      Alert.alert("Upload failed", error.message);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[styles.scrollContainer, commonStyles.container]}
      extraScrollHeight={Platform.OS === "ios" ? 100 : 80}
      enableOnAndroid={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, commonStyles.container]}>
          <Text style={[styles.header, commonStyles.text]}>Create New Listing</Text>

          <TouchableOpacity
            onPress={pickImage}
            style={[styles.imagePickerContainer, commonStyles.card]}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.selectedImage} />
            ) : (
              <View style={[
                styles.imagePlaceholder,
                Theme === "dark" ? { borderColor: colorShades.whiteShades.ghostWhite } : null
              ]}>
                <MaterialIcons 
                  name="add-a-photo" 
                  size={40} 
                  color={getOppositeColor(colorShades, "jet", "white")} 
                />
                <Text style={[styles.imagePlaceholderText, commonStyles.text]}>
                  Add Photos
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Formik
            initialValues={{
              title: "",
              name: "",
              desc: "",
              category: "Furniture",
              address: address ? address.formattedAddress : "",
              image: "",
              seller_name: "",
              useremail: "",
              price: "",
              sellerimage: "",
            }}
            onSubmit={(values, { resetForm }) => {
              if (!values.title || !values.name || !values.desc || 
                  !values.category || !values.price || !values.address) {
                Alert.alert("Error", "All Fields are Required");
                return;
              }
              image_submit(values);
              resetForm();
            }}
            validate={(values) => {
              const errors = {};
              if (!values.title) errors.title = "Required";
              if (!values.name) errors.name = "Required";
              if (!values.desc) errors.desc = "Required";
              if (!values.category) errors.category = "Required";
              if (!values.price) errors.price = "Required";
              if (!values.address) errors.address = "Required";
              return errors;
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, commonStyles.text]}>Title</Text>
                  <TextInput
                    style={[
                      styles.input, 
                      commonStyles.input,
                      Theme === "dark" ? { borderColor: colorShades.whiteShades.ghostWhite } : null
                    ]}
                    placeholder="Enter listing title"
                    value={values.title}
                    onChangeText={handleChange("title")}
                    placeholderTextColor={Theme === "dark" ? colorShades.whiteShades.ghostWhite + "80" : getOppositeColor(colorShades, "dimGray", "dimGray")}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, commonStyles.text]}>Name</Text>
                  <TextInput
                    style={[
                      styles.input, 
                      commonStyles.input,
                      Theme === "dark" ? { borderColor: colorShades.whiteShades.ghostWhite } : null
                    ]}
                    placeholder="Your name"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    placeholderTextColor={Theme === "dark" ? colorShades.whiteShades.ghostWhite + "80" : getOppositeColor(colorShades, "dimGray", "dimGray")}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, commonStyles.text]}>Description</Text>
                  <TextInput
                    style={[
                      styles.input, 
                      commonStyles.input, 
                      { height: 100 },
                      Theme === "dark" ? { borderColor: colorShades.whiteShades.ghostWhite } : null
                    ]}
                    placeholder="Describe your item"
                    value={values.desc}
                    onChangeText={handleChange("desc")}
                    multiline
                    numberOfLines={4}
                    placeholderTextColor={Theme === "dark" ? colorShades.whiteShades.ghostWhite + "80" : getOppositeColor(colorShades, "dimGray", "dimGray")}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, commonStyles.text]}>Category</Text>
                  <TouchableOpacity
                    style={[
                      styles.dropdownButton,
                      commonStyles.input,
                      Theme === "dark" ? { borderColor: colorShades.whiteShades.ghostWhite } : null
                    ]}
                    onPress={() => setShowCategoryModal(true)}
                  >
                    <Text style={[styles.dropdownButtonText, commonStyles.text]}>
                      {values.category || "Select Category"}
                    </Text>
                    <MaterialIcons 
                      name="arrow-drop-down" 
                      size={24} 
                      color={getOppositeColor(colorShades)} 
                    />
                  </TouchableOpacity>

                  <Modal
                    visible={showCategoryModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowCategoryModal(false)}
                  >
                    <TouchableWithoutFeedback onPress={() => setShowCategoryModal(false)}>
                      <View style={styles.modalOverlay}>
                        <View style={[
                          styles.modalContent,
                          Theme === "dark" ? { backgroundColor: colorShades.jet } : null
                        ]}>
                          <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, commonStyles.text]}>Select Category</Text>
                            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                              <MaterialIcons 
                                name="close" 
                                size={24} 
                                color={getOppositeColor(colorShades)} 
                              />
                            </TouchableOpacity>
                          </View>
                          <FlatList
                            data={categorylist}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                style={styles.categoryItem}
                                onPress={() => {
                                  handleChange("category")(item.Name);
                                  setShowCategoryModal(false);
                                }}
                              >
                                <Text style={[styles.categoryItemText, commonStyles.text]}>
                                  {item.Name}
                                </Text>
                              </TouchableOpacity>
                            )}
                          />
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </Modal>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, commonStyles.text]}>Price</Text>
                  <TextInput
                    style={[
                      styles.input, 
                      commonStyles.input,
                      Theme === "dark" ? { borderColor: colorShades.whiteShades.ghostWhite } : null
                    ]}
                    placeholder="Enter price"
                    value={values.price}
                    onChangeText={handleChange("price")}
                    keyboardType="numeric"
                    placeholderTextColor={Theme === "dark" ? colorShades.whiteShades.ghostWhite + "80" : getOppositeColor(colorShades, "dimGray", "dimGray")}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, commonStyles.text]}>Location</Text>
                  <TextInput
                    style={[
                      styles.input, 
                      commonStyles.input,
                      Theme === "dark" ? { borderColor: colorShades.whiteShades.ghostWhite } : null
                    ]}
                    placeholder="Enter location"
                    value={values.address}
                    onChangeText={handleChange("address")}
                    placeholderTextColor={Theme === "dark" ? colorShades.whiteShades.ghostWhite + "80" : getOppositeColor(colorShades, "dimGray", "dimGray")}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton, 
                    { opacity: Loading ? 0.7 : 1 },
                    Theme === "dark" ? { backgroundColor: "#4A90E2" } : null
                  ]}
                  onPress={handleSubmit}
                  disabled={Loading}
                >
                  {Loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Create Listing</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  imagePickerContainer: {
    width: width - 40,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#6c47ff",
    borderStyle: "dashed",
    borderRadius: 10,
  },
  imagePlaceholderText: {
    marginTop: 10,
    fontSize: 16,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#6c47ff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryItemText: {
    fontSize: 16,
  },
});

export default Add;
