import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore";
import { app } from "../firebaseconfig";
import { Redirect } from "expo-router";

export default function SyncUserToFirestore() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState("");
  const db = getFirestore(app);

  useEffect(() => {
    console.log(role);
  }, [role]);
  useEffect(() => {
    const syncAndFetch = async () => {
      if (!isLoaded || !user) return;

      const userId = user.id.toString();
      const userRef = doc(db, "users", userId);

      try {
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          await setDoc(userRef, {
            name: user.fullName,
            email: user.primaryEmailAddress.emailAddress,
            role: "user",
          });
          setRole("user");
        } else {
          const data = docSnap.data();
          setRole(data.role);
        }
      } catch (error) {
        console.error("❌ Firestore error:", error);
      }
    };
    syncAndFetch();
  }, [user, isLoaded]);

  // 🔁 Redirect based on role
  if (role === "admin") return <Redirect href="../(admin)" />;
  if (role === "user") return <Redirect href="../(auth)/home" />;

  return null;
}
