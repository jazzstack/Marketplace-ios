import { collection, getDocs, getFirestore } from "firebase/firestore";
import { createContext, useContext, useState } from "react";
import { app } from "../firebaseconfig";
import { useUser } from "@clerk/clerk-expo";

const Datacontext = createContext();

export const ContextProvider = ({ children }) => {
  const [Posts, SetPosts] = useState([]);
  const [Categories, SetCategories] = useState([]);
  const db = getFirestore(app);
  const { user } = useUser();

  // Funtion that fetches the post data from the firebase
  const GetPostsData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "UserPosts"));
      const data = querySnapshot.docs
        .map((item) => ({ ...item.data(), docId: item.id }))
        .filter(
          (item) => item.useremail !== user.primaryEmailAddress.emailAddress
        );

      SetPosts(data);
    } catch (error) {
      console.log("Error fetching Posts:", error);
    }
  };
  const GetCategoryData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Categories"));
      const categories = querySnapshot.docs.map((doc) => doc.data());

      SetCategories(categories); // Update state once, after collecting all data
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  return (
    <Datacontext.Provider
      value={{ Posts, GetPostsData, Categories, GetCategoryData }}
    >
      {children}
    </Datacontext.Provider>
  );
};
export const useAuth = () => useContext(Datacontext);
