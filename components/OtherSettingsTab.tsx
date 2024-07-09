import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch,
  Box,
  Text,
  VStack
} from "@chakra-ui/react";

interface OtherSettingsTabProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSliderChange: (name: string, value: number) => void;
  handleSwitchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OtherSettingsTab: React.FC<OtherSettingsTabProps> = ({
  formData,
  handleChange,
  handleSliderChange,
  handleSwitchChange
}) => {
  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Voice Temperature ({formData.voice_temperature?.toFixed(2) ?? "0.87"})</FormLabel>
        <Slider
          value={formData.voice_temperature ?? 0.87}
          min={0}
          max={2}
          step={0.01}
          onChange={(value) => handleSliderChange('voice_temperature', value)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>
      <FormControl>
        <FormLabel>Voice Speed ({formData.voice_speed?.toFixed(2) ?? "0.92"})</FormLabel>
        <Slider
          value={formData.voice_speed ?? 0.92}
          min={0}
          max={2}
          step={0.01}
          onChange={(value) => handleSliderChange('voice_speed', value)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>
      <FormControl>
        <FormLabel>Responsiveness ({formData.responsiveness?.toFixed(2) ?? "1.00"})</FormLabel>
        <Slider
          value={formData.responsiveness ?? 1}
          min={0}
          max={1}
          step={0.01}
          onChange={(value) => handleSliderChange('responsiveness', value)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>
      <FormControl>
        <FormLabel>Interruption Sensitivity ({formData.interruption_sensitivity?.toFixed(2) ?? "0.18"})</FormLabel>
        <Slider
          value={formData.interruption_sensitivity ?? 0.18}
          min={0}
          max={1}
          step={0.01}
          onChange={(value) => handleSliderChange('interruption_sensitivity', value)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">Enable Backchannel</FormLabel>
        <Switch
          isChecked={formData.enable_backchannel ?? true}
          onChange={handleSwitchChange}
          name="enable_backchannel"
        />
      </FormControl>
      {formData.enable_backchannel && (
        <>
          <FormControl>
            <FormLabel>Backchannel Frequency ({formData.backchannel_frequency?.toFixed(2) ?? "0.66"})</FormLabel>
            <Slider
              value={formData.backchannel_frequency ?? 0.66}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => handleSliderChange('backchannel_frequency', value)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </FormControl>
          <FormControl>
            <FormLabel>Backchannel Words</FormLabel>
            <Input
              type="text"
              name="backchannel_words"
              value={formData.backchannel_words?.join(', ') ?? 'uh-huh,okay,great,hmm'}
              onChange={handleChange}
            />
          </FormControl>
        </>
      )}
      <FormControl>
        <FormLabel>Ambient Sound</FormLabel>
        <Select
          name="ambient_sound"
          value={formData.ambient_sound ?? ''}
          onChange={handleChange}
        >
          <option value="">None</option>
          <option value="coffee-shop">coffee-shop</option>
          <option value="convention-hall">convention-hall</option>
          <option value="summer-outdoor">summer-outdoor</option>
          <option value="mountain-outdoor">mountain-outdoor</option>
          <option value="static-noise">static-noise</option>
          <option value="call-center">call-center</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Ambient Sound Volume ({formData.ambient_sound_volume?.toFixed(2) ?? "0.12"})</FormLabel>
        <Slider
          value={formData.ambient_sound_volume ?? 0.12}
          min={0}
          max={2}
          step={0.01}
          onChange={(value) => handleSliderChange('ambient_sound_volume', value)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>
      <FormControl>
        <FormLabel>Boosted Keywords</FormLabel>
        <Input
          type="text"
          name="boosted_keywords"
          value={formData.boosted_keywords?.join(', ') ?? ''}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>End Call After Silence (ms)</FormLabel>
        <Input
          type="number"
          name="end_call_after_silence_ms"
          value={formData.end_call_after_silence_ms ?? 10000}
          onChange={handleChange}
        />
      </FormControl>
    </VStack>
  );
};

export default OtherSettingsTab;
