import { View } from "react-native";
import { ReactNode } from "react";
import {Platform} from 'react-native'
export default function ContainerAuth({ children }: { children: ReactNode }) {
  return <View className={`flex-1 bg-[#F2F2EC] px-20 items-center justify-center overflow-hidden pt-${Platform.OS == "ios" ? "40" : "20"}`} >{children}</View> 
     
}

