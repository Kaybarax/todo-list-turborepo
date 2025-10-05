import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardDescription, Container, Flex, Text } from '@todo/ui-web';

const HomePage = () => {
  return (
    <section className="bg-base-200 py-16">
      <Container maxWidth="lg" pad="lg" className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Text as="h1" variant="h1" className="mb-4">
          Welcome to Todo App
        </Text>
        <Text variant="lead" className="mb-10 text-base-content/70">
          A modern todo application with blockchain integration
        </Text>

        <Flex gap="md" justify="center" wrap="wrap" className="mb-12">
          <Button asChild>
            <Link href="/todos">View Todos</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/wallet">Connect Wallet</Link>
          </Button>
        </Flex>

        <Flex gap="lg" wrap="wrap" justify="center">
          <Card elevation="lg" variant="bordered" className="w-80">
            <CardHeader>
              <CardTitle>Blockchain Storage</CardTitle>
              <CardDescription>
                Store your todos on blockchain networks for decentralized, immutable, and censorship-resistant storage.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card elevation="lg" variant="bordered" className="w-80">
            <CardHeader>
              <CardTitle>Multi-Network Support</CardTitle>
              <CardDescription>
                Choose from Solana, Polkadot, Polygon, Moonbeam, or Base networks based on your preferences for speed,
                cost, and features.
              </CardDescription>
            </CardHeader>
          </Card>
        </Flex>
      </Container>
    </section>
  );
};

export default HomePage;
