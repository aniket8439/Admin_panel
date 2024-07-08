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
import AgentTab from "./AgentTab";
import LLMTab from "./LLMTab";
import VoiceTab from "./VoiceTab";
import OtherSettingsTab from "./OtherSettingsTab";

interface CreateAgentFormProps {
  onClose: () => void;
  onCreate: (result: any) => void;
}

interface FormData {
  agent_name: string;
  begin_message: string;
  prompt: string;
  provider: string;
  llmmodel: string;
  voice_id: string;
  voice_temperature?: number;
  voice_speed?: number;
  responsiveness?: number;
  interruption_sensitivity?: number;
  enable_backchannel?: boolean;
  backchannel_frequency?: number;
  backchannel_words?: string[];
  ambient_sound?: string;
  ambient_sound_volume?: number;
  boosted_keywords?: string[];
  end_call_after_silence_ms?: number;
}

export default function CreateAgentForm({ onClose, onCreate }: CreateAgentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    agent_name: "",
    begin_message: "Hello",
    prompt: `You are Nancy, a sophisticated AI voice agent. Your task is to reach out to prospective students interested in studying abroad. Your goals are to identify their needs, provide information, guide them through the application process, and schedule counseling sessions if necessary. Maintain a polite, respectful, and empathetic tone throughout the interaction.`,
    provider: "retell",
    llmmodel: "gpt-3.5-turbo",
    voice_id: "custom-Shanaya",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (name: string, value: number) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch('https://ai-analysis1-woiveba7pq-as.a.run.app/voice_ai/create_voice_agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Agent created successfully:', result);
      const newAgent = {
        agent_id: result.agent_id,
        agent_name: formData.agent_name,
        config: {
          begin_message: formData.begin_message,
          prompt: formData.prompt,
          llmmodel: formData.llmmodel,
          voice_id: formData.voice_id,
          dynamic_variables: [],
        }
      };
      onCreate(newAgent);
      onClose();
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  return (
    <Box bg="white" p={6} rounded="md" shadow="md" w="full" boxShadow="lg">
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Agent</Tab>
          <Tab>Model</Tab>
          <Tab>Voice</Tab>
          <Tab>Other Settings</Tab>
        </TabList>
        <form onSubmit={handleSubmit}>
          <TabPanels>
            <TabPanel>
              <AgentTab formData={formData} handleChange={handleChange} />
            </TabPanel>
            <TabPanel>
              <LLMTab formData={formData} handleChange={handleChange} />
            </TabPanel>
            <TabPanel>
              <VoiceTab formData={formData} handleChange={handleChange} />
            </TabPanel>
            <TabPanel>
              <OtherSettingsTab
                formData={formData}
                handleChange={handleChange}
                handleSliderChange={handleSliderChange}
                handleSwitchChange={handleSwitchChange}
              />
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
