import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export function SwipeHint() {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: 8,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 10,
        transform: [{ translateX }],
        opacity,
      }}
    >
      <View className="flex-1 justify-center items-center">
        <View className="w-[3px] h-full bg-black/20 rounded-full" />
      </View>
    </Animated.View>
  );
}
