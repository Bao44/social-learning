import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import ClickToSpeak from './ClickToSpeak';

const isEnglishWord = (word: string) => {
  return /^[a-zA-Z'’-]+$/.test(word.replace(/[.,!?;:]/g, ''));
};

export default function ExerciseFillInBlank({
  exercise,
  onCheck,
  isChecking,
}: any) {
  const [value, setValue] = useState('');
  const inputRef = useRef<TextInput>(null);
  const { sentence_template, sentence_vi, correct_answer } = exercise.data;

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [exercise.id]);

  const handleCheck = () => {
    if (!value) return;
    const isCorrect =
      value.trim().toLowerCase() === correct_answer.toLowerCase();
    onCheck(isCorrect, correct_answer);
  };

  const getInputStyles = () => {
    if (!isChecking) {
      return [styles.textInput, styles.inputIdle];
    }
    const isCorrect =
      value.trim().toLowerCase() === correct_answer.toLowerCase();
    return isCorrect
      ? [styles.textInput, styles.inputCorrect]
      : [styles.textInput, styles.inputIncorrect];
  };

  const sentenceParts = useMemo(() => {
    const parts = sentence_template.split(/(\s+|___)/g).filter(Boolean);

    return parts.map((part: string, index: number) => {
      if (part === '___') {
        return (
          <TextInput
            key="input"
            ref={inputRef}
            style={getInputStyles()}
            value={value}
            onChangeText={setValue}
            onSubmitEditing={handleCheck}
            editable={!isChecking}
            autoCapitalize="none"
            autoCorrect={false}
          />
        );
      }

      if (isEnglishWord(part)) {
        return <ClickToSpeak key={index} word={part} />;
      }

      return (
        <Text key={index} style={styles.sentenceText}>
          {part}
        </Text>
      );
    });
  }, [sentence_template, value, isChecking]);

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{exercise.question}</Text>
      <Text style={styles.translation}>"{sentence_vi}"</Text>
      <View style={styles.sentenceContainer}>{sentenceParts}</View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleCheck}
          disabled={isChecking || !value}
          style={[
            styles.checkButton,
            (isChecking || !value) && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.checkButtonText}>Kiểm tra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  translation: {
    color: '#6B7280',
    marginBottom: 24,
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: 16,
  },
  sentenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 100,
  },
  sentenceText: {
    fontSize: 18,
    lineHeight: 32,
  },
  textInput: {
    width: 150,
    marginHorizontal: 8,
    paddingVertical: 4,
    fontSize: 18,
    fontWeight: '600',
    color: '#2563EB',
    borderBottomWidth: 2,
    textAlign: 'center',
  },
  inputIdle: {
    borderColor: '#D1D5DB',
  },
  inputCorrect: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  inputIncorrect: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 24,
  },
  checkButton: {
    width: '100%',
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    borderRadius: 12,
  },
  checkButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
  },
});
