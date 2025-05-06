import  { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Heading, Select,
  Textarea, VStack, HStack, Text, Spinner
} from '@chakra-ui/react';
import { translateText } from './api';

export default function App() {
  const [transcript, setTranscript] = useState('');
  const [translated, setTranslated] = useState('');
  const [target, setTarget] = useState('English');
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.lang = 'en-US';
      recog.onresult = e => {
        setTranscript(e.results[0][0].transcript);
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
      const res = await translateText(transcript, target);
      setTranslated(res);
    } catch {
      setTranslated('Error translating text.');
    }
    setLoading(false);
  };

  return (
    <VStack p={6} spacing={4} maxW="600px" mx="auto">
      <Heading size="lg">Speech‑to‑Text & Translation</Heading>

      <HStack>
        <Button colorScheme="blue" onClick={startListening}>Start Speaking</Button>
        <Select value={target} onChange={e => setTarget(e.target.value)}>
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
      >Translate</Button>

      {loading && <Spinner />}

      {translated && (
        <Box p={4} borderWidth={1} borderRadius="md" w="100%">
          <Text fontWeight="bold">Translated Text:</Text>
          <Text mt={2} whiteSpace="pre-wrap">{translated}</Text>
        </Box>
      )}
    </VStack>
  );
}