import { createContext, useContext, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "@clerk/clerk-expo";

const Datacontext = createContext();

export const ContextProvider = ({ children }) => {
  const [Posts, SetPosts] = useState([]);
  const [Categories, SetCategories] = useState([]);
  const { user } = useUser();

  const GetPostsData = async () => {
    try {
      const { data, error } = await supabase
        .from("user_posts")
        .select("*")
        .neq("useremail", user.primaryEmailAddress.emailAddress);

      if (error) throw error;
      SetPosts(data || []);
    } catch (error) {
      console.log("Error fetching Posts:", error);
    }
  };

  const GetCategoryData = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*");

      if (error) throw error;
      SetCategories(data || []);
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
