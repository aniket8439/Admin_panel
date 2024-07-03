"use client";

import { Spinner, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { LuBuilding2 } from "react-icons/lu";
import { FiMail, FiPhone } from "react-icons/fi";
import axios from "axios";

interface CreateCompanyProps {
  userData: any;
  onCompanyCreated: () => void;
}

const CreateCompany: React.FC<CreateCompanyProps> = ({ userData, onCompanyCreated }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    phone: "",
    spocName: "",
    spocTitle: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.phone || !formData.spocName || !formData.spocTitle) {
      toast({
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://ai-analysis1-woiveba7pq-as.a.run.app/dashboard/add_company",
        {
          company_name: formData.companyName,
          spoc_name: formData.spocName,
          spoc_phone: formData.phone,
          spoc_title: formData.spocTitle,
          email: userData.email,
        }
      );

      const data = response.data;
      toast({
        title: "Company Created Successfully",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      console.log("Company created, calling onCompanyCreated...");
      onCompanyCreated();
    } catch (error: unknown) {
      let errorMessage = "An error occurred";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(`Error: ${errorMessage}`);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col justify-center gap-4">
      <div className="text-center space-y-2">
        <div className="text-xl sm:text-3xl text-gray-700 font-bold">
          Welcome to Your New Era of Communication!
        </div>
        <div className="p-4 text-sm sm:text-base">
          Let's get started on this exciting journey. A few quick details
          and you'll be on your way to experiencing the future of AI-driven
          call quality.
        </div>
      </div>
      <div className="flex justify-center mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg">
          <div>
            <label htmlFor="companyName">Company Name</label>
            <div className="border flex rounded-md">
              <div className="bg-gray-200 border-r p-2 px-3 flex items-center rounded-l-md">
                <LuBuilding2 className="text-xl text-gray-500" />
              </div>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Agent Insights etc,"
                className="outline-none border-none p-2 w-full"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email">Organization Email</label>
            <div className="border flex rounded-md">
              <div className="bg-gray-200 border-r p-2 px-3 flex items-center rounded-l-md">
                <FiMail className="text-xl text-gray-500" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={userData?.email || ""}
                readOnly
                className="outline-none border-none p-2 w-full bg-gray-100"
              />
            </div>
          </div>
          <div>
            <label htmlFor="phone">Phone</label>
            <div className="border flex rounded-md">
              <div className="bg-gray-200 border-r p-2 px-3 flex items-center rounded-l-md">
                <FiPhone className="text-xl text-gray-500" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+919812xxxx10"
                className="outline-none border-none p-2 w-full"
              />
            </div>
          </div>
          <div>
            <label htmlFor="spocName">SPOC Name</label>
            <input
              type="text"
              id="spocName"
              name="spocName"
              value={formData.spocName}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="outline-none border rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="spocTitle">SPOC Title</label>
            <input
              type="text"
              id="spocTitle"
              name="spocTitle"
              value={formData.spocTitle}
              onChange={handleChange}
              required
              placeholder="Manager"
              className="outline-none border rounded-md p-2 w-full"
            />
          </div>
          <div className="w-full py-4">
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 text-white font-bold text-center p-2"
            >
              {loading ? <Spinner /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompany;
