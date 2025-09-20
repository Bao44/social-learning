import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const Welcome = () => {
  const navigation = useNavigation<any>();
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  return (
    <LinearGradient
      colors={['#FFF7ED', '#FDF2F8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Social Learning</Text>
      </View>

      <View style={styles.content}>
        <Image
          style={styles.welcomeImage}
          resizeMode="contain"
          source={require('../../assets/images/welcome.png')}
        />
      </View>

      {/* Footer with buttons */}
      <View style={styles.footer}>
        <LinearGradient
          colors={['#F97316', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.linearGradient}
        >
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonTextLogin}>Đăng Nhập</Text>
          </TouchableOpacity>
        </LinearGradient>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.buttonTextSignup}>Tạo tài khoản mới</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 120,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  footer: {
    gap: 15,
    width: '100%',
    alignItems: 'center',
  },
  linearGradient: {
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loginButton: {
    paddingVertical: 12,
    paddingHorizontal: 80,
  },
  signupButton: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 70,
    borderRadius: 25,
    borderWidth: 0.5,
  },
  buttonTextLogin: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonTextSignup: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
