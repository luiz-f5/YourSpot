import { Text } from "@/components/ui/text";
import { Card} from "@/components/ui/card";
import Container from "@/components/custom/Container";
import { SwipeHint } from "@/components/custom/SwipeHint";

export default function DrawerPage() {
  return (
    <Container>
      <SwipeHint />
      <Card>
        <Text className="text-yellow-300">A simple drawer</Text>
      </Card>
    </Container>
  );
}
