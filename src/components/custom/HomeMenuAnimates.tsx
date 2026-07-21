import { memo, useEffect, useState } from "react";
import Animated, { useSharedValue, withTiming, Easing,useAnimatedStyle } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { MapPin, Info } from "lucide-react-native"; 
import { View, TouchableOpacity } from 'react-native'

const iosSmoothCurve = Easing.bezier(0.16, 1, 0.3, 1);

const HomeMenuAnimated = memo(({visible, onClose} : {visible: boolean, onClose: () => void}) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);
    const [isRendering, setIsRendering] = useState(false)

    useEffect(() => {
        if (visible) {
            setIsRendering(true)
            opacity.value = withTiming(1, {duration: 350, easing: iosSmoothCurve})
            translateY.value = withTiming(0, { duration: 400, easing: iosSmoothCurve });
        } else {
            opacity.value = withTiming(1, {duration: 350, easing: Easing.linear})
            translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) }, (finished) => {
            if (finished) scheduleOnRN(setIsRendering, false)
            });
        }
    }, [visible])

      const handleOptionPress = (optionName: string) => {
    onClose();
    setTimeout(() => alert(optionName), 100); 
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
    pointerEvents: opacity.value < 0.1 ? "none" : "auto",
  }));

  if (!isRendering) return null;

    return (
     <Animated.View className="">
      <View className="">
        <TouchableOpacity activeOpacity={0.6} className="" onPress={() => handleOptionPress('📍 Meus Locais')}>
          <Icon as={MapPin} size="md" className="" />
          <Text className="">Meus Locais</Text>
        </TouchableOpacity>
        
        <View className="" />
        
        <TouchableOpacity activeOpacity={0.6} className="" onPress={() => handleOptionPress('ℹ️ Sobre o App')}>
          <Icon as={Info} size="md" className="" />
          <Text className="">Sobre o App</Text>
        </TouchableOpacity>
      </View>
      <View className="" />
    </Animated.View>
    )
})

export default HomeMenuAnimated;