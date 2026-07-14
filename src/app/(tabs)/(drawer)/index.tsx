import { Card } from "@/components/ui/card";
import Container from "@/components/custom/Container";
import { SwipeHint } from "@/components/custom/SwipeHint";

export default function DrawerPage() {
  return (
    <Container>
      <SwipeHint />
      <Card />
    </Container>
  );
}
