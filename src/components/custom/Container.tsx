import { View } from "react-native";
import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return <View className="flex-1 bg-neutral-900 text-white items-center justify-center" >{children}</View>;
}

