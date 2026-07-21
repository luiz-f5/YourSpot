import React from "react";
import { TouchableOpacity, Animated as RNAnimated } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Settings, Camera } from "lucide-react-native";
import { BlurView } from "expo-blur";

interface DraggableButtonsProps {
  panSettings: any;
  panCamera: any;
  responderSettings: any;
  responderCamera: any;
  isDraggingSettings: React.MutableRefObject<boolean>;
  isDraggingCamera: React.MutableRefObject<boolean>;
  onSettingsPress: () => void;
  onCameraPress: () => void;
}

export default function DraggableButtons({
  panSettings,
  panCamera,
  responderSettings,
  responderCamera,
  isDraggingSettings,
  isDraggingCamera,
  onSettingsPress,
  onCameraPress
}: DraggableButtonsProps) {
  return (
    <>
      {/* BOTÃO ENGRENAGEM */}
      <RNAnimated.View
        {...responderSettings.panHandlers}
        style={panSettings.getLayout()}
        className="absolute z-40"
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (!isDraggingSettings.current) onSettingsPress();
          }}
        >
          <BlurView intensity={70} tint="light" className="w-[52px] h-[52px] rounded-full justify-center items-center border border-white/80 shadow-md overflow-hidden bg-white/65">
            <Icon as={Settings} size="md" className="text-zinc-900" />
          </BlurView>
        </TouchableOpacity>
      </RNAnimated.View>

      {/* BOTÃO DA CÂMERA */}
      <RNAnimated.View
        {...responderCamera.panHandlers}
        style={panCamera.getLayout()}
        className="absolute z-40"
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (!isDraggingCamera.current) onCameraPress();
          }}
          className="w-[52px] h-[52px] rounded-full bg-zinc-900 justify-center items-center shadow-lg"
        >
          <Icon as={Camera} size="md" className="text-white" />
        </TouchableOpacity>
      </RNAnimated.View>
    </>
  );
}
