import {MapPin } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import {View } from 'react-native'
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
  export default function  HeaderAuth () {

  <View className="items-center mb-[24p] z-10">
        <View className="">
          <Icon as={MapPin} size="xl" style={{ color: "#1C1C1E" }} />
        </View>
        <Heading className="" size="2xl">
          YourSpot
        </Heading>
        <Text className="">
          Sua cidade em boas mãos: reporte problemas com apenas uma foto.
        </Text>
      </View>
}