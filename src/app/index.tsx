import React from "react";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { Button, ButtonText } from "@/components/ui/button";
import sendMessage from "../services/sendMessage";

export default function App() {
  const [message, setMessage] = useState<string | undefined>("");
  return (
    <View style={styles.container}>
      <Card className="w-100" size="default">
        <Center>
          <Card className="w-90" size="default">
            <Heading className="text-center" size="lg">
              Texto (Lorem Ipsum)
            </Heading>
            <Text className="text-center" size="sm">
              Veja o texto ao clicar no botão abaixo
            </Text>
            {message && (
              <Card>
                <Center>
                  <Text className="text-yellow-200 text-center" size="md">
                    {message}
                  </Text>
                </Center>
              </Card>
            )}
          </Card>
        </Center>
        <Center>
          <Button
            className="bg-zinc-800 w-[8em]"
            onPress={() => {
              const msg = sendMessage() as unknown as string;
              setMessage(msg);
            }}
          >
            <ButtonText size="lg" className="text-yellow-200">
              Clique aqui
            </ButtonText>
          </Button>
        </Center>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
