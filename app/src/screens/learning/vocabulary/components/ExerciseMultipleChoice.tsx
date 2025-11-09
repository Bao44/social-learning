import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ExerciseMultipleChoice({
  exercise,
  onCheck,
  isChecking,
}: any) {
  const [selected, setSelected] = useState<number | null>(null);
  const { options, correct_index } = exercise.data;

  useEffect(() => {
    setSelected(null);
  }, [exercise.id]);

  const handleCheckClick = () => {
    if (selected === null) return;
    const isCorrect = selected === correct_index;
    onCheck(isCorrect, options[correct_index]);
  };

  const getButtonStyles = (index: number) => {
    const styleArray: any[] = [styles.optionButton];
    const textStyleArray: any[] = [styles.optionText];

    if (isChecking) {
      if (index === correct_index) {
        styleArray.push(styles.optionCorrect);
        textStyleArray.push(styles.optionTextCorrect);
      } else if (index === selected && index !== correct_index) {
        styleArray.push(styles.optionIncorrect);
        textStyleArray.push(styles.optionTextIncorrect);
      } else {
        styleArray.push(styles.optionDisabled);
      }
    } else if (selected === index) {
      styleArray.push(styles.optionSelected);
    } else {
      styleArray.push(styles.optionIdle);
    }

    return { button: styleArray, text: textStyleArray };
  };

  return (
    <View>
      <Text style={styles.question}>{exercise.question}</Text>

      <View style={styles.optionsContainer}>
        {options.map((opt: string, i: number) => {
          const { button, text } = getButtonStyles(i);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => setSelected(i)}
              disabled={isChecking}
              style={button}
            >
              <Text style={text}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleCheckClick}
          disabled={selected === null || isChecking}
          style={[
            styles.checkButton,
            (selected === null || isChecking) && styles.buttonDisabled,
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
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'flex-start',
  },
  optionText: {
    fontSize: 18,
  },
  // Trạng thái button
  optionIdle: {
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  optionSelected: {
    borderColor: '#60A5FA',
    backgroundColor: '#DBEAFE',
  },
  optionCorrect: {
    borderColor: '#4ADE80',
    backgroundColor: '#F0FDF4',
  },
  optionTextCorrect: {
    color: '#166534',
    fontWeight: 'bold',
  },
  optionIncorrect: {
    borderColor: '#F87171',
    backgroundColor: '#FEF2F2',
    opacity: 0.5,
  },
  optionTextIncorrect: {
    color: '#B91C1C',
  },
  optionDisabled: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    opacity: 0.5,
  },
  // Nút Check
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
