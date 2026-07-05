import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { Platform } from "react-native";

const rawUrl = Constants.expoConfig?.extra?.supabaseUrl ?? "";
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? "";

if (!rawUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase credentials. Add supabaseUrl and supabaseAnonKey to app.json -> expo -> extra"
  );
}

// Platform-aware URL resolution:
//   iOS simulator → localhost works (shares host network)
//   Android emulator → 10.0.2.2 maps to host machine
//   Physical device → needs machine LAN IP (set in app.json extra.supabaseUrl)
const supabaseUrl = Platform.select({
  android: rawUrl.includes("127.0.0.1")
    ? rawUrl.replace("127.0.0.1", "10.0.2.2")
    : rawUrl,
  default: rawUrl,
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
