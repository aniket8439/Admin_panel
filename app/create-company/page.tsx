"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner, useToast } from "@chakra-ui/react";
import CreateCompany from "../../components/CreateCompany";

const CreateCompanyPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="h-screen w-screen flex align-middle justify-center items-center">
        <Spinner size="lg" color="blue.500" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const handleCompanyCreated = () => {
    toast({
      title: "Company Created Successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <CreateCompany userData={session?.user} onCompanyCreated={handleCompanyCreated} />
    </div>
  );
};

export default CreateCompanyPage;
