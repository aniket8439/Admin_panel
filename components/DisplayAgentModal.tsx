"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Flex, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  VStack, 
  useToast,
  Spinner,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch,
  Text,
  HStack,
} from "@chakra-ui/react";
import PlaceCallModal from './PlaceCallModal';

interface AgentConfig {
  begin_message?: string;
  prompt?: string;
  llmmodel?: string;
  voice_id?: string;
  dynamic_variables?: string[];
}

interface AdditionalSetting {
  ambient_sound?: string;
  ambient_sound_volume?: number;
  backchannel_frequency?: number;
  backchannel_words?: string[];
  boosted_keywords?: string[];
  enable_backchannel?: boolean;
  end_call_after_silence_ms?: number;
  interruption_sensitivity?: number;
  language?: string;
  reminder_max_count?: number;
  reminder_trigger_ms?: number;
  responsiveness?: number;
  voice_speed?: number;
  voice_temperature?: number;
}

interface Agent {
  agent_id: string;
  agent_name: string;
  config: AgentConfig;
  additional_setting: AdditionalSetting;
}

interface DisplayAgentDetailsProps {
  agent: Agent;
  onClose: () => void;
  onAgentUpdated: () => void;
}

const DisplayAgentModal: React.FC<DisplayAgentDetailsProps> = ({ agent: initialAgent, onClose, onAgentUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(initialAgent);
  const [isPlacingCall, setIsPlacingCall] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (initialAgent) {
      setAgent({
        ...initialAgent,
        additional_setting: initialAgent.additional_setting || {},
      });
    }
  }, [initialAgent]);

  const handleSave = async () => {
    if (!agent || !agent.agent_id) {
      console.error('Agent or agent_id is missing');
      toast({
        title: "Error",
        description: "Agent ID is missing.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const additional_setting = agent.additional_setting;

    const payload = {
      ...agent,
      additional_setting,
    };

    try {
      console.log('Saving agent:', payload); // Log the agent being saved

      const response = await fetch(`https://ai-analysis1-woiveba7pq-as.a.run.app/voice_ai/update_agent/${agent.agent_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Agent updated",
        description: "The agent has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setIsEditing(false);
      onAgentUpdated();
    } catch (error) {
      console.error('Error updating agent:', error);
      toast({
        title: "Update failed",
        description: "Failed to update the agent. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAgent(prev => prev ? ({
      ...prev,
      [name]: value
    }) : null);
  };

  const handleAdditionalSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAgent(prev => prev ? ({
      ...prev,
      additional_setting: {
        ...prev.additional_setting,
        [name]: value
      }
    }) : null);
  };

  const handleSliderChange = (name: string, value: number) => {
    setAgent(prev => prev ? ({
      ...prev,
      additional_setting: {
        ...prev.additional_setting,
        [name]: value
      }
    }) : null);
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAgent(prev => prev ? ({
      ...prev,
      additional_setting: {
        ...prev.additional_setting,
        [name]: checked
      }
    }) : null);
  };

  if (!agent) {
    return (
      <Box bg="white" p={6} rounded="md" shadow="md" w="full" boxShadow="lg">
        <Spinner />
      </Box>
    );
  }

  const dynamicVariables = agent.config?.dynamic_variables ?? [];

  return (
    <Box bg="white" p={6} rounded="md" shadow="md" w="full" boxShadow="lg">
      <PlaceCallModal
        agentId={agent.agent_id}
        dynamicVariables={dynamicVariables}
        isOpen={isPlacingCall}
        onClose={() => setIsPlacingCall(false)}
      />
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading as="h2" size="lg">{isEditing ? (
          <Input
            type="text"
            name="agent_name"
            value={agent.agent_name}
            onChange={handleInputChange}
          />
        ) : (
          agent.agent_name
        )}</Heading>
        <Flex>
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)} colorScheme="blue" mr={2}>
                Edit Agent
              </Button>
              <Button onClick={() => setIsPlacingCall(true)} colorScheme="green" mr={2}>
                Place Call
              </Button>
              <Button onClick={onClose} colorScheme="red">
                Close
              </Button>
            </>
          ) : (
            <Button onClick={handleSave} colorScheme="blue" mr={2}>
              Save Agent
            </Button>
          )}
        </Flex>
      </Flex>
      <VStack spacing={4} align="stretch">
        <FormControl isReadOnly={!isEditing}>
          <FormLabel>Begin Message</FormLabel>
          <Input
            type="text"
            name="begin_message"
            value={agent.config?.begin_message ?? ''}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl isReadOnly={!isEditing}>
          <FormLabel>Prompt</FormLabel>
          <Textarea
            name="prompt"
            value={agent.config?.prompt ?? ''}
            readOnly={!isEditing}
            onChange={handleInputChange}
            rows={6}
          />
        </FormControl>
        <FormControl isReadOnly={!isEditing}>
          <FormLabel>LLM Model</FormLabel>
          {isEditing ? (
            <Select
              name="llmmodel"
              value={agent.config?.llmmodel ?? ''}
              onChange={handleInputChange}
            >
              <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
              <option value="gpt-4-turbo" disabled>gpt-4-turbo</option>
              <option value="gpt-4o" disabled>gpt-4o</option>
              <option value="claude-3.5-sonnet" disabled>claude-3.5-sonnet</option>
              <option value="claude-3-haiku" disabled>claude-3-haiku</option>
            </Select>
          ) : (
            <Input
              type="text"
              name="llmmodel"
              value={agent.config?.llmmodel ?? ''}
              readOnly
            />
          )}
        </FormControl>
        <FormControl isReadOnly={!isEditing}>
          <FormLabel>Voice ID</FormLabel>
          {isEditing ? (
            <Select
              name="voice_id"
              value={agent.config?.voice_id ?? ''}
              onChange={handleInputChange}
            >
              <option value="11labs-Adrian">11labs-Adrian</option>
              <option value="custom-Shanaya">custom-Shanaya</option>
              <option value="deepgram-Luna">deepgram-Luna</option>
              <option value="openai-alloy">openai-alloy</option>
            </Select>
          ) : (
            <Input
              type="text"
              name="voice_id"
              value={agent.config?.voice_id ?? ''}
              readOnly
            />
          )}
        </FormControl>
        <VStack spacing={6} align="stretch">
          <FormControl>
            <FormLabel>Voice Temperature</FormLabel>
            <HStack spacing={4}>
              <Slider
                flex="1"
                value={agent.additional_setting?.voice_temperature ?? 1}
                min={0}
                max={1}
                step={0.01}
                onChange={(value) => handleSliderChange('voice_temperature', value)}
                isDisabled={!isEditing}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Box minWidth="60px" textAlign="right">
                <Text fontWeight="bold">{(agent.additional_setting?.voice_temperature ?? 1).toFixed(2)}</Text>
              </Box>
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel>Voice Speed</FormLabel>
            <HStack spacing={4}>
              <Slider
                flex="1"
                value={agent.additional_setting?.voice_speed ?? 1}
                min={0}
                max={1}
                step={0.01}
                onChange={(value) => handleSliderChange('voice_speed', value)}
                isDisabled={!isEditing}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Box minWidth="60px" textAlign="right">
                <Text fontWeight="bold">{(agent.additional_setting?.voice_speed ?? 1).toFixed(2)}</Text>
              </Box>
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel>Responsiveness</FormLabel>
            <HStack spacing={4}>
              <Slider
                flex="1"
                value={agent.additional_setting?.responsiveness ?? 1}
                min={0}
                max={1}
                step={0.01}
                onChange={(value) => handleSliderChange('responsiveness', value)}
                isDisabled={!isEditing}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Box minWidth="60px" textAlign="right">
                <Text fontWeight="bold">{(agent.additional_setting?.responsiveness ?? 1).toFixed(2)}</Text>
              </Box>
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel>Interruption Sensitivity</FormLabel>
            <HStack spacing={4}>
              <Slider
                flex="1"
                value={agent.additional_setting?.interruption_sensitivity ?? 1}
                min={0}
                max={1}
                step={0.01}
                onChange={(value) => handleSliderChange('interruption_sensitivity', value)}
                isDisabled={!isEditing}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Box minWidth="60px" textAlign="right">
                <Text fontWeight="bold">{(agent.additional_setting?.interruption_sensitivity ?? 1).toFixed(2)}</Text>
              </Box>
            </HStack>
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Enable Backchannel</FormLabel>
            <Switch
              isChecked={agent.additional_setting?.enable_backchannel ?? false}
              onChange={handleSwitchChange}
              name="enable_backchannel"
              isDisabled={!isEditing}
            />
          </FormControl>

          {agent.additional_setting?.enable_backchannel && (
            <>
              <FormControl>
                <FormLabel>Backchannel Frequency</FormLabel>
                <HStack spacing={4}>
                  <Slider
                    flex="1"
                    value={agent.additional_setting?.backchannel_frequency ?? 0.9}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(value) => handleSliderChange('backchannel_frequency', value)}
                    isDisabled={!isEditing}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                  <Box minWidth="60px" textAlign="right">
                    <Text fontWeight="bold">{(agent.additional_setting?.backchannel_frequency ?? 0.9).toFixed(2)}</Text>
                  </Box>
                </HStack>
              </FormControl>
              <FormControl>
                <FormLabel>Backchannel Words</FormLabel>
                <Input
                  type="text"
                  name="backchannel_words"
                  value={agent.additional_setting?.backchannel_words?.join(', ') ?? ''}
                  readOnly={!isEditing}
                  onChange={handleAdditionalSettingChange}
                />
              </FormControl>
            </>
          )}

          <FormControl>
            <FormLabel>Ambient Sound</FormLabel>
            {isEditing ? (
              <Select
                name="ambient_sound"
                value={agent.additional_setting?.ambient_sound ?? ''}
                onChange={handleAdditionalSettingChange}
              >
                <option value="coffee-shop">Coffee Shop</option>
                <option value="convention-hall">Convention Hall</option>
                <option value="summer-outdoor">Summer Outdoor</option>
                <option value="mountain-outdoor">Mountain Outdoor</option>
                <option value="static-noise">Static Noise</option>
                <option value="call-center">Call Center</option>
                <option value="">None</option>
              </Select>
            ) : (
              <Input
                type="text"
                name="ambient_sound"
                value={agent.additional_setting?.ambient_sound ?? ''}
                readOnly
              />
            )}
          </FormControl>

          <FormControl>
            <FormLabel>Ambient Sound Volume</FormLabel>
            <HStack spacing={4}>
              <Slider
                flex="1"
                value={agent.additional_setting?.ambient_sound_volume ?? 1}
                min={0}
                max={2}
                step={0.01}
                onChange={(value) => handleSliderChange('ambient_sound_volume', value)}
                isDisabled={!isEditing}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Box minWidth="60px" textAlign="right">
                <Text fontWeight="bold">{(agent.additional_setting?.ambient_sound_volume ?? 1).toFixed(2)}</Text>
              </Box>
            </HStack>
          </FormControl>

          <FormControl isReadOnly={!isEditing}>
            <FormLabel>Boosted Keywords</FormLabel>
            <Input
              type="text"
              name="boosted_keywords"
              value={agent.additional_setting?.boosted_keywords?.join(', ') ?? ''}
              readOnly={!isEditing}
              onChange={handleAdditionalSettingChange}
            />
          </FormControl>

          <FormControl isReadOnly={!isEditing}>
            <FormLabel>End Call After Silence (ms)</FormLabel>
            <Input
              type="number"
              name="end_call_after_silence_ms"
              value={agent.additional_setting?.end_call_after_silence_ms ?? 600000}
              readOnly={!isEditing}
              onChange={handleAdditionalSettingChange}
            />
          </FormControl>
        </VStack>
      </VStack>
    </Box>
  );
};

export default DisplayAgentModal;
