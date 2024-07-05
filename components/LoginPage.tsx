"use client"

import { Box, Button, FormControl, FormLabel, Input, Spinner, useToast, VStack, Heading, Text, HStack, Icon } from "@chakra-ui/react"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const { data: session } = useSession()

  const handleLogin = async () => {
    setLoading(true)
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })
      if (result?.error) {
        toast({
          title: "Login Failed",
          description: result.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  const handleGithubLogin = () => {
    signIn("github", { callbackUrl: "/dashboard" })
  }

  if (session) {
    router.push("/dashboard")
    return null
  }

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-blue-600">
      <Box className="p-6 bg-white rounded-md shadow-lg w-96 max-w-[90vw]">
        <VStack spacing={4}>
          <Heading as="h1" size="lg" textAlign="center">
            Login
          </Heading>
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
          <Text fontSize="sm" color="gray.500" fontWeight="bold">
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
  )
}

export default LoginPage
