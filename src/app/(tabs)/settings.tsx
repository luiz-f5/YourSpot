import Container from "@/components/custom/Container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useSession } from "@/src/ctx";

export default function SettingsPage() {
  const { signOut, session } = useSession();

  return (
    <Container>
      <Card className="p-6">
        <Text className="text-yellow-300 mb-4">Configurações</Text>

        {session && (
          <Text className="text-green-400 mb-4">
            token: {session}
          </Text>
        )}

        <Button onPress={signOut}>
          <ButtonText>Logout</ButtonText>
        </Button>
      </Card>
    </Container>
  );
}
