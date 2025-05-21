import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { hp, wp } from "../common/helper";
import { Dimensions } from "react-native";
import { UseTheme } from "../Context/ThemeContext";

const Slider = ({ source }) => {
  //This will store the current index value whenever any scroll will be done
  const [currentIndex, setIndex] = useState(0);
  //Reference to pass to flatlist for autoscroling
  const flatlistref = useRef();
  const { Theme, commonStyles, getOppositeColor, colorShades } = UseTheme();
  useEffect(() => {
    console.log(Theme);
  }, [Theme]);
  //Each time user scrolls the image or it is auto scroll then this use effect will run because any scroll will change the currentIndex
  useEffect(() => {
    //Time interval to do automatic on basis of current index of scrolled value
    if (source.length === 0) return;
    let interval = setInterval(() => {
      //If the current index is at the last of the image it brings it to the first
      if (currentIndex === source.length - 1) {
        flatlistref.current.scrollToIndex({
          index: 0,
          animation: true,
        });
        // If current index is anywhere else then this will be executed
      } else {
        flatlistref.current.scrollToIndex({
          index: currentIndex + 1,
          animation: true,
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, source]);

  // Funtion to give context to flatlist about the current image size
  const getitemLayout = (item, index) => ({
    length: screenwidth,
    offset: screenwidth * index,
    index: index,
  });
  // Stores the Total screen width
  const screenwidth = Dimensions.get("window").width;

  // Component to render dots
  const Dots = () => {
    return source.map((Dots, index) => {
      return (
        <View
          key={index}
          style={{
            backgroundColor:
              index === currentIndex
                ? Theme === "dark"
                  ? colorShades.whiteShades.ghostWhite
                  : "black"
                : Theme === "dark"
                ? "#4A5568"
                : "#D3D3D3",
            height: hp(1),
            width: hp(1),
            borderRadius: 100,
            marginHorizontal: wp(1.6),
          }}
        ></View>
      );
    });
  };

  //Funtion that runs on every time a scroll happens and chnaged the x index value in the state
  const handleScroll = (event) => {
    const scrollposition = event.nativeEvent.contentOffset.x;
    // console.log(scrollposition);
    const value = Math.round(scrollposition / screenwidth);
    // console.log(value);
    setIndex(value);
  };
  return (
    <View style={{ marginTop: "5%" }}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={flatlistref}
        getItemLayout={getitemLayout}
        pagingEnabled
        data={source}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: Theme === "dark" ? "#1a1a1a" : "#fff",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: item.Image }}
              style={{ width: screenwidth, height: hp(25) }}
            />
          </View>
        )}
        onScroll={handleScroll}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: wp(2),
        }}
      >
        {Dots()}
      </View>
    </View>
  );
};

export default Slider;
