import React, { createContext, useState, useContext, useEffect } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestLocationPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied");
        Alert.alert(
          "Permission Denied",
          "Please enable location services to use this feature."
        );
        return false;
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      // Get address details
      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (addressResult) {
        setAddress({
          city: addressResult.city,
          region: addressResult.region,
          country: addressResult.country,
          postalCode: addressResult.postalCode,
          street: addressResult.street,
          formattedAddress: `${addressResult.street || ""}, ${
            addressResult.city || ""
          }, ${addressResult.region || ""}`,
        });
      }
    } catch (err) {
      setError(err.message);
      Alert.alert("Error", "Failed to get location");
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    location,
    address,
    loading,
    error,
    getCurrentLocation,
    requestLocationPermission,
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};
