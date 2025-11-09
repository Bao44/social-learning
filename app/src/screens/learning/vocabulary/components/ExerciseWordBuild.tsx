import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Letter {
  id: number;
  char: string;
}

export default function ExerciseWordBuild({
  exercise,
  onCheck,
  isChecking,
}: any) {
  const { letters, answer, hint } = exercise.data;

  const initialBank = useMemo(
    () => letters.map((char: string, id: number) => ({ id, char })),
    [letters],
  );

  const [bank, setBank] = useState<Letter[]>(initialBank);
  const [currentWord, setCurrentWord] = useState<Letter[]>([]);

  useEffect(() => {
    setBank(initialBank);
    setCurrentWord([]);
  }, [exercise.id, initialBank]);

  const handleSelectFromBank = (letter: Letter) => {
    setCurrentWord([...currentWord, letter]);
    setBank(bank.filter(l => l.id !== letter.id));
  };

  const handleSelectFromAnswer = (letter: Letter) => {
    setCurrentWord(currentWord.filter(l => l.id !== letter.id));
    setBank([...bank, letter].sort((a, b) => a.id - b.id));
  };

  const handleCheck = () => {
    const word = currentWord.map(l => l.char).join('');
    const isCorrect = word === answer;
    onCheck(isCorrect, answer);
  };

  const getBorderStyle = () => {
    if (!isChecking) return styles.answerBoxIdle;
    const word = currentWord.map(l => l.char).join('');
    return word === answer
      ? styles.answerBoxCorrect
      : styles.answerBoxIncorrect;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{exercise.question}</Text>
      <Text style={styles.hint}>Gợi ý: "{hint}"</Text>

      {/* Vùng Câu trả lời */}
      <View style={[styles.answerBox, getBorderStyle()]}>
        {currentWord.map(letter => (
          <TouchableOpacity
            key={letter.id}
            onPress={() => !isChecking && handleSelectFromAnswer(letter)}
            style={styles.letterChipAnswer}
          >
            <Text style={styles.letterText}>{letter.char}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Vùng "Bank" */}
      <View style={styles.bankBox}>
        {bank.map(letter => (
          <TouchableOpacity
            key={letter.id}
            onPress={() => !isChecking && handleSelectFromBank(letter)}
            disabled={isChecking}
            style={styles.letterChipBank}
          >
            <Text style={styles.letterText}>{letter.char}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleCheck}
          disabled={currentWord.length === 0 || isChecking}
          style={[
            styles.checkButton,
            (currentWord.length === 0 || isChecking) && styles.buttonDisabled,
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
    alignItems: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  hint: {
    color: '#6B7280',
    marginBottom: 24,
    fontSize: 18,
    fontStyle: 'italic',
  },
  answerBox: {
    minHeight: 60,
    width: '100%',
    padding: 8,
    borderBottomWidth: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
  letterChipAnswer: {
    width: 48,
    height: 56,
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
  letterChipBank: {
    width: 48,
    height: 56,
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  letterText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 40,
    width: '100%',
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
