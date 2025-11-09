import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const shuffle = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

type Pair = { a: string; b: string };
type Selected = { side: 'a' | 'b'; value: string } | null;

export default function ExerciseSynonymMatch({
  exercise,
  onCheck,
  isChecking,
}: any) {
  const { pairs }: { pairs: Pair[] } = exercise.data;

  const colA = useMemo(() => shuffle([...pairs.map(p => p.a)]), [pairs]);
  const colB = useMemo(() => shuffle([...pairs.map(p => p.b)]), [pairs]);

  const [selected, setSelected] = useState<Selected>(null);
  const [matched, setMatched] = useState<string[]>([]);

  useEffect(() => {
    setSelected(null);
    setMatched([]);
  }, [exercise.id]);

  const handleSelect = (side: 'a' | 'b', value: string) => {
    if (isChecking || matched.includes(value)) return;

    if (!selected) {
      setSelected({ side, value });
      return;
    }

    if (selected.side === side) {
      setSelected({ side, value });
      return;
    }

    const pairA = side === 'a' ? value : selected.value;
    const pairB = side === 'b' ? value : selected.value;
    const isMatch = pairs.some(p => p.a === pairA && p.b === pairB);

    if (isMatch) {
      setMatched([...matched, pairA, pairB]);
      setSelected(null);
    } else {
      setSelected(null);
    }
  };

  const isCompleted = matched.length === pairs.length * 2;

  const getButtonStyles = (side: 'a' | 'b', value: string) => {
    if (matched.includes(value)) {
      return styles.buttonMatched;
    }
    if (selected?.side === side && selected?.value === value) {
      return styles.buttonSelected;
    }
    return styles.buttonIdle;
  };

  const handleCheck = () => {
    onCheck(true, 'Hoàn thành ghép cặp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{exercise.question}</Text>

      <View style={styles.matchContainer}>
        {/* Cột A */}
        <View style={styles.column}>
          {colA.map((value: string, i: number) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleSelect('a', value)}
              disabled={isChecking || matched.includes(value)}
              style={[styles.matchButton, getButtonStyles('a', value)]}
            >
              <Text style={styles.matchText}>{value}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Cột B */}
        <View style={styles.column}>
          {colB.map((value: string, i: number) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleSelect('b', value)}
              disabled={isChecking || matched.includes(value)}
              style={[styles.matchButton, getButtonStyles('b', value)]}
            >
              <Text style={styles.matchText}>{value}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleCheck}
          disabled={!isCompleted || isChecking}
          style={[
            styles.checkButton,
            (!isCompleted || isChecking) && styles.buttonDisabled,
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
    gap: 12,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  matchContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  matchButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchText: {
    fontSize: 16,
  },
  buttonIdle: {
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  buttonSelected: {
    borderColor: '#60A5FA',
    backgroundColor: '#DBEAFE',
  },
  buttonMatched: {
    borderColor: '#4ADE80',
    backgroundColor: '#F0FDF4',
    opacity: 0.5,
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
