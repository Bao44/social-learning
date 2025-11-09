import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from '@react-native-voice/voice';
import { Mic, Volume2 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import Tts from 'react-native-tts';
import ClickToSpeak from './ClickToSpeak';

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[.,!?;:\\"'()[\]{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export default function ExerciseSpeaking({
  exercise,
  onCheck,
  isChecking,
}: any) {
  const { sentence, ipa, sentence_vi } = exercise.data;

  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<React.ReactNode | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [error, setError] = useState('');
  const MAX_WRONG_ATTEMPTS = 3;

  const hasCheckedRef = useRef(false);
  const wasListeningRef = useRef(false);

  useEffect(() => {
    Tts.getInitStatus().then(() => Tts.setDefaultLanguage('en-US'));

    Voice.removeAllListeners();

    const onSpeechStart = () => {
      setError('');
      setListening(true);
      wasListeningRef.current = true;
    };
    let speechEndTimeout: any;
    Voice.onSpeechEnd = () => {
      if (speechEndTimeout) clearTimeout(speechEndTimeout);

      speechEndTimeout = setTimeout(() => {
        setListening(false);
      }, 700); // delay 700ms để cho user nói tiếp
    };
    Voice.onSpeechResults = event => {
      if (event.value && event.value.length > 0) {
        setTranscript(event.value?.[0] || '');
      }
    };
    Voice.onSpeechPartialResults = event => {
      if (event.value && event.value.length > 0) {
        setTranscript(event.value?.[0] || '');
      }
    };
    Voice.onSpeechError = e => {
      if (e.error?.code === '11') {
        setError('Không nghe rõ. Hãy thử nói lại.');
        setTranscript('');
        return;
      }

      setListening(false);
    };

    Voice.onSpeechStart = onSpeechStart;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    resetTranscript();
    setResult(null);
    setAttemptCount(0);
    hasCheckedRef.current = false;
    wasListeningRef.current = false;
  }, [exercise.id]);

  const resetTranscript = () => {
    setTranscript('');
  };

  const speak = () => {
    Tts.stop();
    Tts.speak(sentence);
  };

  const checkPronunciation = (spokenText: string) => {
    const sample = normalize(sentence);
    const spoken = normalize(spokenText);
    const sampleWords = sample.split(' ');
    const spokenWords = spoken.split(' ');

    let isCorrect = true;
    if (sampleWords.length !== spokenWords.length) isCorrect = false;

    const compared = sampleWords.map((word, i) => {
      if (spokenWords[i] === word) {
        return (
          <Text key={i} style={styles.textCorrect}>
            {word}{' '}
          </Text>
        );
      } else {
        isCorrect = false;
        return (
          <Text key={i} style={styles.textIncorrect}>
            {spokenWords[i] || '___'}{' '}
          </Text>
        );
      }
    });

    if (spokenWords.length > sampleWords.length) {
      isCorrect = false;
      for (let i = sampleWords.length; i < spokenWords.length; i++) {
        compared.push(
          <Text key={i} style={styles.textExtra}>
            {spokenWords[i]}{' '}
          </Text>,
        );
      }
    }
    setResult(<View style={styles.resultContainer}>{compared}</View>);
    return isCorrect;
  };

  const handleCheck = (spokenText: string) => {
    if (hasCheckedRef.current || isChecking) return;
    hasCheckedRef.current = true;

    const isCorrect = checkPronunciation(spokenText);

    if (isCorrect) {
      Toast.show({ type: 'success', text1: 'Chính xác!' });
      setAttemptCount(0);
      onCheck(true, sentence);
    } else {
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      if (newAttemptCount >= MAX_WRONG_ATTEMPTS) {
        Toast.show({
          type: 'error',
          text1: `Bạn đã sai quá ${MAX_WRONG_ATTEMPTS} lần.`,
        });
        setAttemptCount(0);
        onCheck(false, sentence);
      } else {
        const attemptsLeft = MAX_WRONG_ATTEMPTS - newAttemptCount;
        Toast.show({
          type: 'info',
          text1: `Sai rồi! Bạn còn ${attemptsLeft} lần thử.`,
        });
      }
    }
  };

  const startListening = async () => {
    if (listening || isChecking) return;

    resetTranscript();
    setResult(null);
    hasCheckedRef.current = false;

    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error('startListening error: ', e);
    }
  };

  useEffect(() => {
    if (
      !listening &&
      wasListeningRef.current &&
      !isChecking &&
      !hasCheckedRef.current
    ) {
      wasListeningRef.current = false;
      handleCheck(transcript);
    }
  }, [listening, isChecking, transcript]);

  const clickableSentence = useMemo(() => {
    return sentence.split(/(\s+)/g).map((part: string, index: number) => {
      if (part.trim() === '')
        return (
          <Text key={index} style={styles.sentenceText}>
            {part}
          </Text>
        );
      return <ClickToSpeak key={index} word={part} />;
    });
  }, [sentence]);

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{exercise.question}</Text>

      <View style={styles.sentenceBox}>
        <TouchableOpacity onPress={speak} style={styles.speakButton}>
          <Volume2 size={28} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.sentenceText}>{clickableSentence}</Text>
      </View>
      <Text style={styles.ipa}>{ipa}</Text>
      <Text style={styles.translation}>"{sentence_vi}"</Text>

      <View style={styles.micButtonContainer}>
        <TouchableOpacity
          onPress={startListening}
          disabled={listening || isChecking}
          style={[
            styles.micButton,
            listening ? styles.micButtonListening : styles.micButtonIdle,
          ]}
        >
          <Mic size={24} color="white" />
          <Text style={styles.micButtonText}>
            {listening ? 'Đang nghe' : 'Bắt đầu nói'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transcriptBox}>
        <Text style={styles.transcriptTitle}>Bạn đã nói:</Text>
        {result ? (
          result
        ) : (
          <Text style={styles.transcriptText}>{transcript || '...'}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
  },
  sentenceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  speakButton: {
    padding: 8,
  },
  sentenceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
    flexShrink: 1,
  },
  ipa: {
    color: '#6B7280',
    fontStyle: 'italic',
  },
  translation: {
    color: '#9CA3AF',
  },
  micButtonContainer: {
    paddingTop: 24,
  },
  micButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 99,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  micButtonIdle: {
    backgroundColor: '#3B82F6',
  },
  micButtonListening: {
    backgroundColor: '#9CA3AF',
  },
  micButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transcriptBox: {
    minHeight: 100,
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transcriptTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
  },
  transcriptText: {
    color: '#374151',
    fontStyle: 'italic',
  },
  resultContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  textCorrect: {
    color: '#16A34A',
    fontWeight: '600',
    fontSize: 16,
  },
  textIncorrect: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 16,
  },
  textExtra: {
    color: '#EF4444',
    textDecorationLine: 'line-through',
    fontWeight: '600',
    fontSize: 16,
  },
});
