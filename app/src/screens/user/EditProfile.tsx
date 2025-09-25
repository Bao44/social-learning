import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/Header';
import useAuth from '../../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import {
  getUserImageSrc,
  requestGalleryPermission,
  uploadFile,
} from '../../api/image/route';
import { launchImageLibrary } from 'react-native-image-picker';
import { updateUserData } from '../../api/user/route';
import Toast from 'react-native-toast-message';

export default function EditProfileScreen() {
  const { user, setUser } = useAuth();
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    nickName: user?.nick_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || '',
    gender: user?.gender ?? null,
    avatar: user?.avatar || null,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nickName: user.nick_name || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        gender: user.gender ?? null,
        avatar: user.avatar || null,
      });
    }
  }, [user]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Toast.show({ type: 'error', text1: 'Quyền bị từ chối' });
      return;
    }

    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      if (response.didCancel) return;
      if (response.errorCode) {
        Toast.show({
          type: 'error',
          text1: 'Lỗi khi chọn ảnh',
          text2: response.errorMessage,
        });
        return;
      }

      const asset = response.assets?.[0];
      if (!asset?.uri) return;

      setIsLoading(true);
      const res = await uploadFile('profiles', asset.uri, 'image');
      if (!res?.success) {
        Toast.show({
          type: 'error',
          text1: 'Upload thất bại',
          text2: res?.message,
        });
        return;
      }
      handleChange('avatar', res.data.path);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể upload ảnh',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Số điện thoại không hợp lệ',
      });
      return;
    }

    if (formData.bio && formData.bio.length > 300) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Tiểu sử không được vượt quá 300 ký tự',
      });
      return;
    }

    const updatedUser: any = {};

    if (formData.nickName !== (user?.nick_name || ''))
      updatedUser.nick_name = formData.nickName;
    if (formData.phone !== (user?.phone || ''))
      updatedUser.phone = formData.phone;
    if (formData.address !== (user?.address || ''))
      updatedUser.address = formData.address;
    if (formData.bio !== (user?.bio || '')) updatedUser.bio = formData.bio;
    if (formData.gender !== user?.gender) updatedUser.gender = formData.gender;
    if (formData.avatar !== (user?.avatar || null))
      updatedUser.avatar = formData.avatar;

    if (Object.keys(updatedUser).length === 0) {
      Toast.show({
        type: 'info',
        text1: 'Thông báo',
        text2: 'Không có thay đổi nào để cập nhật',
      });
      navigation.goBack();
      return;
    }

    try {
      setIsLoading(true);
      await updateUserData(user?.id, updatedUser);
      setUser({ ...user, ...updatedUser });
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Cập nhật thành công',
      });
      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: err.message || 'Đã xảy ra lỗi',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: 'white' }}>
      <Header title="Chỉnh sửa trang cá nhân" />

      {/* Avatar */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{
              uri: formData.avatar
                ? getUserImageSrc(formData.avatar)
                : null,
            }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        </TouchableOpacity>
        <Text style={{ marginTop: 8, color: 'blue' }}>Đổi ảnh</Text>
      </View>

      {/* Nickname */}
      <Text>Biệt danh</Text>
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
        }}
        value={formData.nickName}
        onChangeText={v => handleChange('nickName', v)}
      />

      {/* Phone */}
      <Text>Số điện thoại</Text>
      <TextInput
        keyboardType="phone-pad"
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
        }}
        value={formData.phone}
        onChangeText={v => handleChange('phone', v)}
      />

      {/* Address */}
      <Text>Địa chỉ</Text>
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
        }}
        value={formData.address}
        onChangeText={v => handleChange('address', v)}
      />

      {/* Bio */}
      <Text>Tiểu sử</Text>
      <TextInput
        multiline
        numberOfLines={4}
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
          textAlignVertical: 'top',
        }}
        value={formData.bio}
        onChangeText={v => handleChange('bio', v)}
      />

      {/* Gender */}
      <Text>Giới tính</Text>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        {['Nam', 'Nữ', 'Khác'].map(g => (
          <TouchableOpacity
            key={g}
            onPress={() =>
              handleChange(
                'gender',
                g === 'Nam' ? true : g === 'Nữ' ? false : null,
              )
            }
            style={{
              flex: 1,
              padding: 10,
              borderWidth: 1,
              marginRight: 5,
              borderRadius: 8,
              backgroundColor:
                (g === 'Nam' && formData.gender === true) ||
                (g === 'Nữ' && formData.gender === false) ||
                (g === 'Khác' && formData.gender === null)
                  ? '#f59e0b'
                  : 'white',
            }}
          >
            <Text style={{ textAlign: 'center' }}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isLoading}
        style={{
          backgroundColor: '#f97316',
          padding: 14,
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Lưu thay đổi
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
