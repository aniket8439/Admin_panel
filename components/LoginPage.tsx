"use client";

import { Box, Button, FormControl, FormLabel, Input, Spinner, useToast, VStack, Heading, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Don't do anything while loading

    if (session) {
      if (session.user.companyExists) {
        localStorage.setItem('authToken', session.user.authToken);
        router.push("/dashboard");
      } else {
        router.push("/create-company");
      }
    }
  }, [session, status, router]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast({
          title: "Login Failed",
          description: result.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleGithubLogin = () => {
    signIn("github", { callbackUrl: "/" });
  };

  if (status === 'loading') {
    return <Spinner />;
  }

  if (session) {
    return null; // or a loading indicator if you prefer
  }

  return (
    <Box className="flex items-center h-screen w-full">
      <Box className="h-screen w-1/2 bg-black flex flex-col justify-center p-12 text-white">
        <Heading as="h3" size="lg" mb={3}>Welcome Back!</Heading>
        <Text fontSize="md">
          Please login to your account using your credentials or continue with one of the social login options.
        </Text>
      </Box>

      <Box className="w-1/2 bg-white flex flex-row item-center justify-center">
        <Box className="flex flex-col justify-center">
          <VStack spacing={3} align="stretch" width="full">
            <Heading as="h1" size="lg" textAlign="center">Login</Heading>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                focusBorderColor="blue.500"
                isRequired
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                focusBorderColor="blue.500"
                isRequired
              />
            </FormControl>
            <Button
              onClick={handleLogin}
              colorScheme="blue"
              isLoading={loading}
              loadingText="Logging in"
              width="full"
              mt={4}
            >
              Login
            </Button>
            <Text fontSize="sm" color="gray.500" fontWeight="bold" className="text-center">
              - or -
            </Text>
            <Button
              width="full"
              variant="outline"
              leftIcon={<FcGoogle />}
              onClick={handleGoogleLogin}
              mb={3}
            >
              Continue with Google
            </Button>
            <Button
              width="full"
              variant="outline"
              leftIcon={<FaGithub />}
              onClick={handleGithubLogin}
            >
              Continue with GitHub
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;