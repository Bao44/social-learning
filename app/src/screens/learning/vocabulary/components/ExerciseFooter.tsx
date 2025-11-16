import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type FeedbackStatus = {
  status: 'correct' | 'incorrect';
  correctAnswer: string;
} | null;

interface Props {
  feedback: FeedbackStatus;
}

export default function ExerciseFooter({ feedback }: Props) {
  if (!feedback) {
    return null;
  }

  const isCorrect = feedback?.status === 'correct';
  const title = isCorrect ? 'Chính xác!' : 'Không chính xác';

  const containerStyle = isCorrect ? styles.correctBg : styles.incorrectBg;
  const titleStyle = isCorrect ? styles.correctText : styles.incorrectText;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {!isCorrect && (
        <Text style={styles.answerText}>
          Đáp án đúng:{' '}
          <Text style={styles.bold}>{feedback.correctAnswer}</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 'auto',
    padding: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  correctBg: {
    backgroundColor: '#F0FDF4',
  },
  incorrectBg: {
    backgroundColor: '#FEF2F2',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  correctText: {
    color: '#15803D',
  },
  incorrectText: {
    color: '#DC2626',
  },
  answerText: {
    marginTop: 8,
    color: '#374151',
  },
  bold: {
    fontWeight: 'bold',
  },
});
