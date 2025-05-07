// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Heading,
  Select,
  Textarea,
  VStack,
  HStack,
  Text,
  Spinner
} from '@chakra-ui/react';
import { translateText } from './api';

export default function App() {
  const [transcript, setTranscript] = useState<string>('');
  const [translated, setTranslated] = useState<string>('');
  const [target, setTarget] = useState<string>('English');
  const [loading, setLoading] = useState<boolean>(false);

  // Use any for SpeechRecognition instance
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (SR) {
      const recog = new SR();
      recog.continuous = false;
      recog.lang = 'en-US';
      recog.onresult = (event: any) => {
        setTranscript(event.results[0][0].transcript);
      };
      recognitionRef.current = recog;
    }
  }, []);

  const startListening = () => {
    setTranscript('');
    recognitionRef.current?.start();
  };

  const handleTranslate = async () => {
    setLoading(true);
    setTranslated('');
    try {
      const translatedText = await translateText(transcript, target);
      setTranslated(translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslated('Error translating text.');
    }
    setLoading(false);
  };

  return (
    <VStack p={6} spacing={4} maxW="600px" mx="auto">
      <Heading size="lg">Speech-to-Text & Translation</Heading>

      <HStack>
        <Button colorScheme="blue" onClick={startListening}>
          Start Speaking
        </Button>
        <Select
          value={target}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setTarget(e.target.value)
          }
          maxW="200px"
        >
          <option>English</option>
          <option>Chinese</option>
          <option>Malay</option>
          <option>Tamil</option>
          <option>Hindi</option>
        </Select>
      </HStack>

      <Textarea
        value={transcript}
        placeholder="Your speech will appear here..."
        rows={4}
        isReadOnly
      />

      <Button
        colorScheme="green"
        onClick={handleTranslate}
        isDisabled={!transcript}
        isLoading={loading}
      >
        Translate
      </Button>

      {loading && <Spinner size="lg" />}

      {translated && (
        <Box p={4} borderWidth={1} borderRadius="md" w="100%">
          <Text fontWeight="bold">Translated Text:</Text>
          <Text mt={2} whiteSpace="pre-wrap">{translated}</Text>
        </Box>
      )}
    </VStack>
  );
}
