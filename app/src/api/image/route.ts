import { SUPABASE_URL } from '@env';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';
import api from '../../../lib/api';

export const getUserImageSrc = (imagePath: any) => {
  if (imagePath) {
    if (typeof imagePath === 'string') {
      return `${SUPABASE_URL}/storage/v1/object/public/uploads/${imagePath}`; // Trả về string URL trực tiếp
    }
    return imagePath;
  }
  return '/default-avatar-profile-icon.jpg'; // Trả về ảnh mặc định
};

export const getSupabaseFileUrl = (filePath: any) => {
  if (filePath) {
    return `${SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`;
  }
  return null;
};

export const uploadFile = async (
  folderName: string,
  file: any, // trên web là File, trên app là uri string
  isImage = 'image',
) => {
  try {
    let fileBase64: string;

    if (typeof file === 'string' && file.startsWith('file://')) {
      fileBase64 = await RNFS.readFile(file, 'base64');
    } else {
      fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          if (typeof result === 'string') {
            resolve(result.split(',')[1]);
          } else {
            reject(new Error('FileReader result is not a string'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    const response = await api.post('/api/images/uploads', {
      folderName,
      fileBase64,
      isImage,
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        msg: error.response.data.message || 'Could not upload media',
      };
    }
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const requestGalleryPermission = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]);
      return (
        granted['android.permission.READ_MEDIA_IMAGES'] ===
        PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }
  return true;
};
