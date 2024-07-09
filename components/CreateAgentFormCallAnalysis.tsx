import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  VStack,
  useToast,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import AgentTabCallAnalysis from "./AgentTabCallAnalysis";
import LLMTabCallAnalysis from "./LLMTabCallAnalysis";
import VoiceTabCallAnalysis from "./VoiceTabCallAnalysis";

interface CreateAgentFormProps {
  onClose: () => void;
  onCreate: (result: any) => void;
  onAgentCreated: () => void;
}

interface FormData {
  agent_name: string;
  prompt: string;
  llmmodel: string;
  language: string;
}

const defaultPrompt = `To evaluate the agent's performance based on the provided script, here is a summary of the essential elements:
Information Extraction
Lead Details: Extracted from the conversation, including name, course interest, intended country, and intake period.
Financial Planning: Discussion about budget, whether funding through self or loan.
Academic Background: Checking the lead's academic scores and qualifications.
Counselling Session: Status of scheduling a counseling session.
Script Follow Analysis
Introduction and Verification: Agent successfully verified the lead's identity and explained the call's purpose.
Inquiry Confirmation: Details of the study program and intake period were correctly confirmed.
Academic and Qualifications: Agent collected accurate academic information.
Budget and Financial Planning: Provided clear information on costs and financial planning.
Document Verification and Closing: Necessary documents were requested, and the counseling session was successfully scheduled.
Sales Pitch Analysis
Personal Address and Context Establishment: Agent used the lead's name effectively and referenced previous communications.
Interest Confirmation and Benefits Highlight: Confirmed interest and outlined the program benefits.
Urgency and Offers: Created urgency about application deadlines and mentioned financial incentives.
Payment Process and Commitment Encouragement: Discussed payment options and encouraged scheduling a detailed counseling session.
Overall Recommendations
Ensure clarity throughout the call.
Address lead's specific concerns directly.
Follow up promptly on commitments and document submissions.
Proactively offer additional information on scholarships and services.
Scores and Actions
Script Follow Score: Calculated based on the completeness and accuracy in following the script.
Sales Pitch Score: Assessed based on how effectively the agent pitched the services and addressed the lead's potential concerns.`;

const defaultllmmodel = 'nova-2';
const defaultlanguage = "en";

export default function CreateAgentFormCallAnalysis({ onClose, onCreate, onAgentCreated }: CreateAgentFormProps) {
  const [activeTab, setActiveTab] = useState("Agent");
  const [formData, setFormData] = useState<FormData>({
    agent_name: "",
    prompt: defaultPrompt,
    llmmodel: defaultllmmodel,
    language: defaultlanguage,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/ui_routes/add_agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          agent_name: formData.agent_name,
          configuration_log: {
            ai_prompt: formData.prompt,
            LLMModel: formData.llmmodel,
            language: formData.language,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Agent created successfully:', result);
      onCreate(result);
      onAgentCreated();
      onClose();
    } catch (error) {
      console.error('Error creating agent:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Box bg="white" p={6} rounded="md" shadow="md" w="full" boxShadow="lg">
      <Tabs variant="enclosed" isFitted>
        <TabList>
          <Tab>Agent</Tab>
          <Tab>Model</Tab>
          <Tab>Language</Tab>
        </TabList>
        <form onSubmit={handleSubmit}>
          <TabPanels>
            <TabPanel>
              <AgentTabCallAnalysis formData={formData} handleChange={handleChange} />
            </TabPanel>
            <TabPanel>
              <LLMTabCallAnalysis formData={formData} handleChange={handleChange} />
            </TabPanel>
            <TabPanel>
              <VoiceTabCallAnalysis formData={formData} handleChange={handleChange} />
            </TabPanel>
          </TabPanels>
          <HStack justifyContent="end" mt={6} spacing={2}>
            <Button onClick={onClose} colorScheme="gray">Cancel</Button>
            <Button type="submit" colorScheme="blue">Create Agent</Button>
          </HStack>
        </form>
      </Tabs>
    </Box>
  );
}
