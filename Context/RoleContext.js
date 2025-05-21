import { createContext, useContext, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import { app } from "../firebaseconfig";

const RoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const { user, isLoaded } = useUser(); // ✅ wait until user is loaded
    const db = getFirestore(app);

    const fetchUserData = async () => {
        if (!isLoaded || !user) return;

        try {
            const userDoc = await getDoc(doc(db, "users", user.id));
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            } else {
                console.log("User not found in Firestore");
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
