import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { supabase } from "../lib/supabase";
import { Redirect } from "expo-router";

export default function SyncUserToSupabase() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState("");

  useEffect(() => {
    console.log(role);
  }, [role]);

  useEffect(() => {
    const syncAndFetch = async () => {
      if (!isLoaded || !user) return;

      const userId = user.id;
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Supabase error:", error);
          return;
        }

        if (!data) {
          const { error: insertError } = await supabase
            .from("users")
            .insert({
              id: userId,
              name: user.fullName,
              email: user.primaryEmailAddress.emailAddress,
              role: "user",
            });

          if (insertError) {
            console.error("Insert error:", insertError);
            return;
          }
          setRole("user");
        } else {
          setRole(data.role);
        }
      } catch (error) {
        console.error("Supabase error:", error);
      }
    };

    syncAndFetch();
  }, [user, isLoaded]);

  if (role === "admin") return <Redirect href="../(admin)" />;
  if (role === "user") return <Redirect href="../(auth)/home" />;

  return null;
}
