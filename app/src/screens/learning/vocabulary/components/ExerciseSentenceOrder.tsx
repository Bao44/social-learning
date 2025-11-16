import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Word {
  id: number;
  text: string;
}

export default function ExerciseSentenceOrder({
  exercise,
  onCheck,
  isChecking,
}: any) {
  const { shuffled, answer_en, answer_vi } = exercise.data;

  const initialBank = useMemo(
    () => shuffled.map((text: string, id: number) => ({ id, text })),
    [shuffled],
  );

  const [bank, setBank] = useState<Word[]>(initialBank);
  const [answer, setAnswer] = useState<Word[]>([]);

  useEffect(() => {
    setBank(initialBank);
    setAnswer([]);
  }, [exercise.id, initialBank]);

  const handleSelectFromBank = (word: Word) => {
    setAnswer([...answer, word]);
    setBank(bank.filter(w => w.id !== word.id));
  };

  const handleSelectFromAnswer = (word: Word) => {
    setAnswer(answer.filter(w => w.id !== word.id));
    setBank([...bank, word].sort((a, b) => a.id - b.id));
  };

  const handleCheck = () => {
    const sentence = answer.map(w => w.text).join(' ');
    const isCorrect = sentence.toLowerCase() === answer_en.toLowerCase();
    onCheck(isCorrect, answer_en);
  };

  const getBorderStyle = () => {
    if (!isChecking) return styles.answerBoxIdle;
    const sentence = answer.map(w => w.text).join(' ');
    return sentence === answer_en
      ? styles.answerBoxCorrect
      : styles.answerBoxIncorrect;
  };

  return (
    <View>
      <Text style={styles.question}>{exercise.question}</Text>
      <Text style={styles.translation}>"{answer_vi}"</Text>

      <View style={[styles.answerBox, getBorderStyle()]}>
        {answer.map(word => (
          <TouchableOpacity
            key={word.id}
            onPress={() => !isChecking && handleSelectFromAnswer(word)}
            style={styles.wordChipAnswer}
          >
            <Text style={styles.wordText}>{word.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Vùng "Bank" */}
      <View style={styles.bankBox}>
        {bank.map(word => (
          <TouchableOpacity
            key={word.id}
            onPress={() => !isChecking && handleSelectFromBank(word)}
            disabled={isChecking}
            style={styles.wordChipBank}
          >
            <Text style={styles.wordText}>{word.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleCheck}
          disabled={answer.length === 0 || isChecking}
          style={[
            styles.checkButton,
            (answer.length === 0 || isChecking) && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.checkButtonText}>Kiểm tra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 22,
  },
  answerBox: {
    minHeight: 60,
    padding: 8,
    borderBottomWidth: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  answerBoxIdle: {
    borderBottomColor: '#E5E7EB',
  },
  answerBoxCorrect: {
    borderBottomColor: '#22C55E',
  },
  answerBoxIncorrect: {
    borderBottomColor: '#EF4444',
  },
  bankBox: {
    minHeight: 100,
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  wordChipAnswer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  wordChipBank: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  wordText: {
    fontSize: 18,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 40,
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
