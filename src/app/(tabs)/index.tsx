import React from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { Button, ButtonText } from "@/components/ui/button";
import Container from "@/components/custom/Container";
import sendMessage from "@/services/apis/lorem/methods/sendMessage";

export default function App() {
  const [message, setMessage] = useState<string | undefined>("");
  return (
    <Container>
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
            variant="outline"
            className="w-[8em]"
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
    </Container>
  );
}
