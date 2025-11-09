import React, { useMemo, useCallback } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Tts from 'react-native-tts';

interface Props {
  word: string;
}

Tts.getInitStatus().then(
  () => {
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.5);
  },
  err => {
    if (err.code === 'no_engine') {
      console.warn('No TTS engine installed.');
    }
  },
);

export default function ClickToSpeak({ word }: Props) {
  const cleanWord = useMemo(() => {
    return word.replace(/[.,!?;:]/g, '').trim();
  }, [word]);

  const speak = useCallback(() => {
    if (!cleanWord) return;
    Tts.stop();
    Tts.speak(cleanWord);
  }, [cleanWord]);

  return (
    <Pressable onPress={speak}>
      <Text style={styles.speakableText}>{word}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  speakableText: {
    fontWeight: 'bold',
    padding: 4,
    borderRadius: 6,
  },
});
