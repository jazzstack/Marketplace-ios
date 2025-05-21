import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_STORAGE_KEY = "@app_theme_preference";
const THEME_MODE_STORAGE_KEY = "@app_theme_mode"; // 'system', 'light', or 'dark'

export const Themecontext = createContext();

export const ThemeProvider = ({ children }) => {
  const [Theme, SetTheme] = useState(Appearance.getColorScheme());
  const [Pref, Setpref] = useState(Appearance.getColorScheme());
  const [themeMode, setThemeMode] = useState("system"); // 'system', 'light', or 'dark'

  // Load saved theme preferences
  useEffect(() => {
    loadSavedTheme();
  }, []);

  // Save theme preferences whenever they change
  useEffect(() => {
    saveThemePreferences();
  }, [Theme, themeMode]);

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      Setpref(colorScheme);
      if (themeMode === "system") {
        SetTheme(colorScheme);
      }
    });

    return () => subscription.remove();
  }, [themeMode]);

  const loadSavedTheme = async () => {
    try {
      const [savedTheme, savedMode] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(THEME_MODE_STORAGE_KEY),
      ]);

      if (savedMode) {
        setThemeMode(savedMode);
        if (savedMode === "system") {
          SetTheme(Appearance.getColorScheme());
        } else if (savedTheme) {
          SetTheme(savedTheme);
        }
      }
    } catch (error) {
      console.error("Error loading theme preferences:", error);
    }
  };

  const saveThemePreferences = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(THEME_STORAGE_KEY, Theme),
        AsyncStorage.setItem(THEME_MODE_STORAGE_KEY, themeMode),
      ]);
    } catch (error) {
      console.error("Error saving theme preferences:", error);
    }
  };

  const SetdarkTheme = () => {
    SetTheme("dark");
    setThemeMode("dark");
  };
  const SetLightTheme = () => {
    SetTheme("light");
    setThemeMode("light");
  };
  const SetSystemTheme = () => {
    setThemeMode("system");
    SetTheme(Appearance.getColorScheme());
  };
  const colorShades = {
    blackShades: {
      dark: "black",
      jet: "#343434",
      charcoal: "#36454F",
      eerieBlack: "#1B1B1B",
      dimGray: "#696969",
    },
    whiteShades: {
      white: "#FFFFFF",
      snow: "#FFFAFA",
      ghostWhite: "#F8F8FF",
      ivory: "#FFFFF0",
      floralWhite: "#FFFAF0",
    },
  };

  const getOppositeColor = (
    colorShades,
    darkKey = "eerieBlack",
    lightKey = "ghostWhite"
  ) => {
    if (Theme === "dark") {
      return colorShades.whiteShades[lightKey];
    } else if (Theme === "light") {
      return colorShades.blackShades[darkKey];
    }
  };

  const getSameColor = (colorShades, darkKey, lightKey) => {
    if (Theme === "dark") {
      return { color: colorShades.blackShades[darkKey] };
    } else if (Theme === "light") {
      return { color: colorShades.whiteShades[lightKey] };
    }
  };

  // Common styles that can be used across the app
  const commonStyles = {
    container: {
      backgroundColor:
        Theme === "dark"
          ? colorShades.blackShades.eerieBlack
          : colorShades.whiteShades.ghostWhite,
    },
    text: {
      color:
        Theme === "dark"
          ? colorShades.whiteShades.ghostWhite
          : colorShades.blackShades.eerieBlack,
    },
    card: {
      backgroundColor:
        Theme === "dark"
          ? colorShades.blackShades.jet
          : colorShades.whiteShades.white,
      shadowColor: Theme === "dark" ? "#000" : "#666",
    },
    input: {
      backgroundColor:
        Theme === "dark"
          ? colorShades.blackShades.jet
          : colorShades.whiteShades.snow,
      color:
        Theme === "dark"
          ? colorShades.whiteShades.ghostWhite
          : colorShades.blackShades.eerieBlack,
    },
    border: {
      borderColor:
        Theme === "dark"
          ? colorShades.whiteShades.ghostWhite
          : colorShades.blackShades.eerieBlack,
    },
  };

  return (
    <Themecontext.Provider
      value={{
        Theme,
        SetTheme,
        SetLightTheme,
        SetdarkTheme,
        SetSystemTheme,
        Pref,
        themeMode,
        getSameColor,
        getOppositeColor,
        colorShades,
        commonStyles,
      }}
    >
      {children}
    </Themecontext.Provider>
  );
};

export const UseTheme = () => useContext(Themecontext);
