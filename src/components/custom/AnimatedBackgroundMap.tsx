import React, { useEffect, useRef} from 'react'
import {Easing} from "react-native-reanimated";
import {Animated, View, StyleSheet, Dimensions} from 'react-native'
import Svg, { Path, Circle, Rect, G } from "react-native-svg";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function AnimatedBackgroundMap()  {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 25000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 25000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animValue]);

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 30],
  });

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-25, 25],
  });

  const rotate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["-18deg", "-12deg"],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View
      className={`w-${windowWidth * 1.8} h-${windowHeight * 1.6} absolute left-${-windowHeight * 0.4} top-${-windowWidth * 0.3}`}
        style={{
            transform: [
              { translateX },
              { translateY },
              { rotate },
              { skewX: "-8deg" },
              { scale: 1.15 },
            ],
          }
        }
      >
        <Svg height="100%" width="100%" viewBox="0 0 800 1000">
          <G opacity={0.35}>
            {/* Blocos da Cidade / Edifícios */}
            <Rect x="40" y="80" width="180" height="120" rx="16" fill="#E2E2D9" />
            <Rect x="260" y="60" width="220" height="160" rx="20" fill="#D8D8CE" />
            <Rect x="520" y="100" width="240" height="140" rx="16" fill="#E2E2D9" />

            <Rect x="60" y="260" width="160" height="200" rx="20" fill="#D8D8CE" />
            <Rect x="500" y="300" width="260" height="180" rx="24" fill="#E2E2D9" />

            <Rect x="80" y="520" width="220" height="160" rx="20" fill="#E2E2D9" />
            <Rect x="340" y="540" width="180" height="220" rx="16" fill="#D8D8CE" />
            <Rect x="560" y="520" width="200" height="180" rx="20" fill="#E2E2D9" />

            {/* Parques / Áreas Verdes */}
            <Rect x="260" y="280" width="200" height="200" rx="30" fill="#D2E3D0" />
            <Circle cx="360" cy="380" r="40" fill="#B2D8B0" />

            {/* Malha de Ruas e Avenidas Principais */}
            <Path
              d="M -50,220 L 850,220 M -50,500 L 850,500 M -50,780 L 850,780"
              stroke="#FFFFFF"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <Path
              d="M 240,-50 L 240,1050 M 480,-50 L 480,1050 M 740,-50 L 740,1050"
              stroke="#FFFFFF"
              strokeWidth="28"
              strokeLinecap="round"
            />

            {/* Linhas de Centro Amarelas */}
            <Path
              d="M -50,220 L 850,220 M -50,500 L 850,500"
              stroke="#E3C066"
              strokeWidth="3"
              strokeDasharray="12, 12"
            />
            <Path
              d="M 240,-50 L 240,1050 M 480,-50 L 480,1050"
              stroke="#E3C066"
              strokeWidth="3"
              strokeDasharray="12, 12"
            />

            {/* Pins Decorativos */}
            <Circle cx="360" cy="380" r="12" fill="#1C1C1E" />
            <Circle cx="360" cy="380" r="6" fill="#FFFFFF" />

            <Circle cx="600" cy="220" r="10" fill="#1C1C1E" />
            <Circle cx="600" cy="220" r="5" fill="#FFFFFF" />
          </G>
        </Svg>
      </Animated.View>

      {/* Overlay Suave */}
      <View  className="bg-zinc-100" style={StyleSheet.absoluteFill} />
    </View>
  );
};