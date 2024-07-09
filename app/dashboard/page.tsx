"use client";

import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { 
  Button, 
  VStack, 
  Heading, 
  Text, 
  Container, 
  SimpleGrid, 
  Box, 
  Icon,
  useColorModeValue,
  useToast,
  HStack
} from "@chakra-ui/react";
import { FiMic, FiBarChart2, FiSmile } from "react-icons/fi";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (session?.user?.authToken) {
      localStorage.setItem('authToken', session.user.authToken);
    }
  }, [session]);

  const handleNavigation = (path: string) => {
    toast({
      title: `Navigating to ${path}`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
    router.push(`/dashboard${path}`);
  };

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");

  return (
    <Box bg={bgColor} minH="100vh" py={16}>
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4}>
              Welcome, {session?.user?.name}
            </Heading>
            <Text fontSize="xl" color="gray.500">
              Select an option below to get started
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <DashboardCard 
              title="Voice AI"
              description="Analyze and manage voice interactions with AI"
              icon={FiMic}
              onClick={() => handleNavigation('/voice-ai')}
              bgColor={cardBgColor}
            />
            <DashboardCard 
              title="Call Analysis"
              description="In-depth analysis and insights from your calls"
              icon={FiBarChart2}
              onClick={() => handleNavigation('/call-analysis')}
              bgColor={cardBgColor}
            />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  bgColor: string;
}

function DashboardCard({ title, description, icon, onClick, bgColor }: DashboardCardProps) {
  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      p={8}
      boxShadow="xl"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", boxShadow: "2xl" }}
      cursor="pointer"
      onClick={onClick}
    >
      <VStack spacing={6} align="flex-start">
        <Icon as={icon} boxSize={12} color="blue.500" />
        <VStack align="flex-start" spacing={2}>
          <Heading as="h3" size="lg">
            {title}
          </Heading>
          <Text color="gray.500">{description}</Text>
        </VStack>
        <HStack width="full">
          <Button colorScheme="blue" size="lg" flex={1}>
            Get Started
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}