import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  isOpen: boolean;
  onRefill: () => void;
  onGoBack: () => void;
  canRefill: boolean;
}

export default function OutOfLivesModal({
  isOpen,
  onRefill,
  onGoBack,
  canRefill,
}: Props) {
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onGoBack}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.emoji}>😢</Text>
          <Text style={styles.title}>Bạn đã hết mạng!</Text>
          <Text style={styles.subtitle}>Bạn đã mất hết ❄️ của mình.</Text>

          <View style={styles.buttonGroup}>
            {canRefill ? (
              <>
                <TouchableOpacity
                  onPress={onRefill}
                  style={[styles.buttonBase, styles.buttonRefill]}
                >
                  <Text style={[styles.buttonText, styles.textWhite]}>
                    Dùng 5 ❄️ mua 1 mạng
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onGoBack}
                  style={[styles.buttonBase, styles.buttonBack]}
                >
                  <Text style={[styles.buttonText, styles.textGray]}>
                    Quay lại
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.errorText}>
                  Bạn đã dùng quyền trợ giúp. Luyện tập thất bại.
                </Text>
                <TouchableOpacity
                  onPress={onGoBack}
                  style={[styles.buttonBase, styles.buttonBackDark]}
                >
                  <Text style={[styles.buttonText, styles.textWhite]}>
                    Quay lại
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    maxWidth: 384,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  subtitle: {
    color: '#4B5563',
    marginTop: 8,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
    marginTop: 24,
  },
  buttonBase: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonRefill: {
    backgroundColor: '#3B82F6',
  },
  buttonBack: {
    backgroundColor: 'transparent',
  },
  buttonBackDark: {
    backgroundColor: '#374151',
  },
  textWhite: {
    color: 'white',
  },
  textGray: {
    color: '#374151',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
  },
});
