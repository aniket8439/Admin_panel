"use client"

import { Box, FormControl, FormLabel, Input, Spinner, useToast } from "@chakra-ui/react"
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
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </FormControl>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-lg font-bold flex gap-2 justify-center align-middle w-full mt-4 p-2 text-white rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading && <Spinner color="white" />} <span>Login</span>
        </button>
        <div className="text-center p-2 font-bold text-gray-500">- or -</div>
        <button
          className="px-7 py-2 w-full gap-2 bg-white text-black border border-blue-100 font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out flex justify-center items-center mb-3"
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="text-2xl" />
          <span>Continue with Google</span>
        </button>
        <button
          className="px-7 py-2 w-full gap-2 bg-white text-black border border-blue-100 font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out flex justify-center items-center mb-3"
          onClick={handleGithubLogin}
        >
          <FaGithub className="text-2xl" />
          <span>Continue with GitHub</span>
        </button>
      </Box>
    </Box>
  )
}

export default LoginPage