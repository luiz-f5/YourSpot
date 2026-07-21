import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { BlurView } from "expo-blur";

export interface TourStep {
  title: string;
  description: string;
  position: { top?: number; bottom?: number; left?: number; right?: number };
}

interface TourGuideProps {
  visible: boolean;
  currentStep: number;
  steps: TourStep[];
  onNext: () => void;
  onSkip: () => void;
}

export const TourGuide = ({
  visible,
  currentStep,
  steps,
  onNext,
  onSkip
}: TourGuideProps) => {
  if (!visible || !steps[currentStep]) return null;
  const step = steps[currentStep];

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      className="absolute inset-0 z-50 justify-center items-center"
    >
      <BlurView intensity={30} tint="dark" className="absolute inset-0 w-full h-full" />
      <View
        className="absolute w-[280px] bg-white/95 rounded-2xl p-[18px] border-1.5 border-white/80 shadow-2xl"
        style={step.position}
      >
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-[12px] font-semibold text-zinc-400">Passo {currentStep + 1} de {steps.length}</Text>
          <TouchableOpacity onPress={onSkip}>
            <Text className="text-[12px] font-semibold text-zinc-500">Pular</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-base font-bold text-zinc-900 mb-1.5">{step.title}</Text>
        <Text className="text-xs text-zinc-600 leading-relaxed mb-4">{step.description}</Text>

        <Button size="sm" className="bg-zinc-900 rounded-xl h-[38px] active:bg-zinc-800" onPress={onNext}>
          <ButtonText className="color-white text-[13px] font-semibold">
            {currentStep === steps.length - 1 ? "Entendi!" : "Próximo"}
          </ButtonText>
        </Button>
      </View>
    </Animated.View>
  );
};

export default TourGuide;
