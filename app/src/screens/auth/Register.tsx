import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { BookOpen } from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import Toast from 'react-native-toast-message';

const Register = () => {
  const navigation = useNavigation<any>();

  const handleSignUp = () => {
    // Xử lý đăng ký tài khoản ở đây
    Toast.show({
      type: 'success',
      text1: 'Đăng ký thành công!',
      visibilityTime: 1000,
    });
  };

  return (
    <ScreenWrapper bg="#FFF7ED">
      <LinearGradient colors={['#FFF7ED', '#FDF2F8']} style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#F97316', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logo}
          >
            <BookOpen size={20} color="#fff" />
          </LinearGradient>
          <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
            <Text style={styles.logoText}>SocialLearning</Text>
          </TouchableOpacity>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <LinearGradient
              colors={['#F97316', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cardIcon}
            >
              <BookOpen size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.cardTitle}>Tham gia SocialLearning</Text>
            <Text style={styles.cardDescription}>
              Tạo tài khoản của bạn và bắt đầu học cùng nhau
            </Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tên tài khoản</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên tài khoản của bạn"
                placeholderTextColor="#A1A1AA"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập email của bạn"
                placeholderTextColor="#A1A1AA"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput
                style={styles.input}
                placeholder="Tạo mật khẩu mạnh"
                placeholderTextColor="#A1A1AA"
                secureTextEntry
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Xác nhận mật khẩu</Text>
              <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu của bạn"
                placeholderTextColor="#A1A1AA"
                secureTextEntry
              />
            </View>
            <LinearGradient
              colors={['#F97316', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.buttonText}>Tạo tài khoản</Text>
              </TouchableOpacity>
            </LinearGradient>
            <Text style={styles.footerText}>
              Bạn đã có tài khoản?{' '}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate('Login')}
              >
                Đăng nhập
              </Text>
            </Text>
          </View>
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 16,
    left: 16,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  cardHeader: {
    alignItems: 'center',
    padding: 16,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
  cardContent: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: '#111827',
    height: 40,
  },
  checkboxContainer: {
    marginVertical: 12,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  checkboxText: {
    fontSize: 12,
    color: '#4B5563',
  },
  link: {
    color: '#F97316',
    textDecorationLine: 'underline',
  },
  button: {
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default Register;
