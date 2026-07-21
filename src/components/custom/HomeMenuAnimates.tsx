import React, { memo, useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Animated, { useSharedValue, withTiming, Easing, useAnimatedStyle, runOnJS } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { MapPin, Info, LogOut } from "lucide-react-native";

const iosSmoothCurve = Easing.bezier(0.16, 1, 0.3, 1);

interface HomeMenuAnimatedProps {
  visible: boolean;
  onClose: () => void;
  onSignOut: () => void;
  onNavigate: (route: string) => void;
}

const HomeMenuAnimated = memo(({
  visible,
  onClose,
  onSignOut,
  onNavigate
}: HomeMenuAnimatedProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsRendering(true);
      opacity.value = withTiming(1, { duration: 350, easing: iosSmoothCurve });
      translateY.value = withTiming(0, { duration: 400, easing: iosSmoothCurve });
    } else {
      opacity.value = withTiming(0, { duration: 250, easing: Easing.linear });
      translateY.value = withTiming(15, { duration: 300, easing: Easing.out(Easing.quad) }, (finished) => {
        if (finished) runOnJS(setIsRendering)(false);
      });
    }
  }, [visible]);

  const handleOptionPress = (optionName: string, route: string) => {
    onClose();
    setTimeout(() => onNavigate(route), 100);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
    pointerEvents: opacity.value < 0.1 ? "none" : "auto",
  }));

  if (!isRendering) return null;

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute bottom-[120px] w-[220px] align-center items-center z-50 self-center"
    >
      <BlurView intensity={80} tint="light" className="w-full rounded-2xl border-1.5 border-white/70 shadow-lg overflow-hidden bg-white/75">
        <TouchableOpacity
          activeOpacity={0.6}
          className="py-3.5 px-5 w-full flex-row items-center justify-start"
          onPress={() => handleOptionPress('📍 Meus Locais', "/my-reports")}
        >
          <Icon as={MapPin} size="md" className="text-zinc-900 mr-3" />
          <Text className="text-[15px] font-semibold text-zinc-900 tracking-tight">Meus Locais</Text>
        </TouchableOpacity>

        <View className="h-[1px] bg-black/10 mx-3" />

        <TouchableOpacity
          activeOpacity={0.6}
          className="py-3.5 px-5 w-full flex-row items-center justify-start"
          onPress={() => handleOptionPress('ℹ️ Sobre o App', "/about")}
        >
          <Icon as={Info} size="md" className="text-zinc-900 mr-3" />
          <Text className="text-[15px] font-semibold text-zinc-900 tracking-tight">Sobre o App</Text>
        </TouchableOpacity>

        <View className="h-[1px] bg-black/10 mx-3" />

        <TouchableOpacity
          activeOpacity={0.6}
          className="py-3.5 px-5 w-full flex-row items-center justify-start bg-red-500/10"
          onPress={() => {
            onClose();
            onSignOut();
          }}
        >
          <Icon as={LogOut} size="md" className="text-red-600 mr-3" />
          <Text className="text-[15px] font-semibold text-red-600 tracking-tight">Sair da Conta</Text>
        </TouchableOpacity>
      </BlurView>

      {/* Setinha apontando para baixo */}
      <View
        className="w-0 h-0 border-solid border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/75 -mt-[1px]"
      />
    </Animated.View>
  );
});

export default HomeMenuAnimated;
