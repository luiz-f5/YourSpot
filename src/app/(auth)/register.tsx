import React, { useState } from "react";
import Container from "@/components/custom/Container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { useSession } from "@/services/auth/session";
import { Link } from "expo-router";

export default function RegisterScreen() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <Container>
      <Card className="p-6">
        <Text className="text-yellow-300 text-center mb-4">Registrar</Text>

        <Input className="mb-3">
          <InputField placeholder="Email" value={email} onChangeText={setEmail} />
        </Input>

        <Input className="mb-4">
          <InputField
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </Input>

        {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}

        <Button
          onPress={async () => {
            try {
              if (!email || !password) throw new Error("Preencha todos os campos");
              await signIn(email, password);
              setError(null);
            } catch (err: any) {
              setError(err.message || "Erro ao registrar");
            }
          }}
          className="mb-4"
        >
          <ButtonText>Criar Conta</ButtonText>
        </Button>

        <Link href="/(auth)/login">
          <Text className="text-blue-400 text-center">Login</Text>
        </Link>
      </Card>
    </Container>
  );
}
