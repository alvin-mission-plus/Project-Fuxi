import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Animated,
  StatusBar
} from "react-native";
import StyledButton from "../components/StyledButton.js";

const { width, height } = Dimensions.get("screen");

const DATA = [
  {
    key: 1,
    title: "Welcome to Project Fuxi",
    description:
      "Project Fuxi harnesses music's power to enhance mental wellbeing for dementia patients. Start this transformative journey today.",
    image: require("../assets/fuxiIcon.png"),
    style: {
      width: width * 0.7,
      height: height * 0.7,
      resizeMode: "contain",
    },
  },
  {
    key: 2,
    title: "Personalize Your Experience",
    description:
      "With dementia's unique effects on individuals, our music therapy is tailored to fit their distinct needs, guiding them towards tranquillity.",
    image: require("../assets/landing/26783.png"),
    style: {
      width: width,
      height: height,
      resizeMode: "contain",
    },
  },
  {
    key: 3,
    title: "Explore a World of Musical Wellness",
    description:
      "Delve into our diverse music library, handpicked for dementia patients. Our tunes range from calming to energizing, designed to spark joy and peace.",
    image: require("../assets/landing/5508.png"),
    style: {
      width: width,
      height: height,
      resizeMode: "contain",
    },
  },
];

const bgs = ["#E6E6FA", "#93CAED", "#90EE90"];

const Indicator = ({ scrollX }) => {
  return (
    <View style={{ flexDirection: "row", bottom: 100, position: "absolute" }}>
      {DATA.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1.4, 0.8],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            key={`indicator-${i}`}
            style={{
              height: 7,
              width: 7,
              backgroundColor: "#333",
              borderRadius: 5,
              margin: 10,
              transform: [{ scale }],
            }}
          />
        );
      })}
    </View>
  );
};

const BackDrop = ({ scrollX }) => {
  const backgroundColor = scrollX.interpolate({
    inputRange: bgs.map((_, i) => i * width),
    outputRange: bgs.map((_, i) => _),
  });
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor,
        },
      ]}
    />
  );
};

function LandingScreen({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <BackDrop scrollX={scrollX} />
      <Animated.FlatList
        data={DATA}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          return (
            <View style={{ width, alignItems: "center", padding: 20 }}>
              <View style={{ flex: 0.7, justifyContent: "center" }}>
                <Image source={item.image} style={item.style} />
              </View>
              <View style={{ flex: 0.3 }}>
                <Text
                  style={{ fontWeight: "800", fontSize: 28, paddingBottom: 10 }}
                >
                  {item.title}
                </Text>
                <Text style={{ fontWeight: "300" }}>{item.description}</Text>
              </View>
            </View>
          );
        }}
      />
      <Indicator scrollX={scrollX} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          width,
          position: "absolute",
          bottom: 20,
        }}
      >
        <StyledButton
          text="Login"
          onPress={() => navigation.navigate("Login")}
        />
        <StyledButton
          text="Signup"
          onPress={() => navigation.navigate("Signup")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LandingScreen;
