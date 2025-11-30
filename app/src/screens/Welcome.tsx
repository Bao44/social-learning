import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

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
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(60),
  },
  header: {
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  title: {
    fontSize: moderateScale(40),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeImage: {
    width: scale(300),
    height: scale(300),
    marginBottom: verticalScale(20),
  },
  footer: {
    gap: verticalScale(15),
    width: '100%',
    alignItems: 'center',
  },
  linearGradient: {
    borderRadius: moderateScale(25),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '100%',
  },
  loginButton: {
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    width: '100%',
  },
  signupButton: {
    backgroundColor: '#FFF',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(25),
    borderWidth: 0.5,
    width: '100%',
    alignItems: 'center',
  },
  buttonTextLogin: {
    color: '#fff',
    fontSize: moderateScale(16),
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonTextSignup: {
    color: '#000',
    fontSize: moderateScale(16),
    textAlign: 'center',
    fontWeight: '500',
  },
});
