import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import { LogOut } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../lib/supabase';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const Options = () => {
  const navigation = useNavigation<any>();
  const handleLogout = async () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: logout,
        },
      ],
      { cancelable: true },
    );
  };

  const logout = async () => {
    await supabase.auth.signOut();
    Toast.show({
      type: 'success',
      text1: 'Đăng xuất thành công.',
      visibilityTime: 2000,
    });
    navigation.navigate('Welcome');
  };

  return (
    <View>
      <Header title="Cài đặt và hoạt động" />
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Tùy chọn</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LogOut size={moderateScale(24)} color="#333" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Options;

const styles = StyleSheet.create({
  contentContainer: {
    padding: scale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(8),
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    width: '100%',
  },
  logoutText: {
    marginLeft: scale(10),
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
});
