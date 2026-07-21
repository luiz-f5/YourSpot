import React from "react";
import { View } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";

interface InputWrapperAuthProps {
  icon: any;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export default function InputWrapperAuth({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none"
}: InputWrapperAuthProps) {
  return (
    <View className="flex-row items-center bg-[#F4F4EE] rounded-2xl border border-zinc-200/40 px-3.5 mb-3.5 h-12">
      <Icon as={icon} size="md" className="text-zinc-500 mr-2.5" />
      <Input className="flex-1 border-0 h-full bg-transparent">
        <InputField
          placeholder={placeholder}
          placeholderTextColor="#8E8E93"
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          className="text-zinc-900 text-sm font-medium h-full"
        />
      </Input>
    </View>
  );
}
