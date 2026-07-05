import { createContext, useContext, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "@clerk/clerk-expo";

const RoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const { user, isLoaded } = useUser();

    const fetchUserData = async () => {
        if (!isLoaded || !user) return;

        try {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error && error.code !== "PGRST116") {
                console.log("Error fetching user data:", error);
                return;
            }

            if (data) {
                setUserData(data);
            } else {
                console.log("User not found in Supabase");
            }
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
    };

    return (
        <RoleContext.Provider value={{ fetchUserData, userData }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useUserRole = () => useContext(RoleContext);
