import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import useAuth from '../../../hooks/useAuth';
import { hp } from '../../../helpers/common';
import { theme } from '../../../constants/theme';
import Button from '../../components/Button';
import { FileImage, Trash, VideoIcon, ArrowLeft } from 'lucide-react-native';
import RichTextEditor from '../../components/RichTextEditor';
import {
  getSupabaseFileUrl,
  getUserImageSrc,
  requestGalleryPermission,
} from '../../api/image/route';
import Avatar from '../../components/Avatar';
import Toast from 'react-native-toast-message';
import {
  convertFileToBase64,
  CreatePostData,
  updatePost,
} from '../../api/post/route';
import { launchImageLibrary } from 'react-native-image-picker';
import { useEffect, useRef, useState } from 'react';
import Video from 'react-native-video';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';

interface FileData {
  uri: string;
  type: string;
  name: string;
  fileSize?: number;
}

const EditPost = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const route = useRoute();
  const { post }: any = route.params;
  const bodyRef = useRef(post?.content || '');
  const editorRef = useRef<{
    setText: (text: string) => void;
    setContentHTML: (html: string) => void;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<FileData | null>(null);

  useEffect(() => {
    if (post) {
      setTimeout(() => {
        editorRef.current?.setText(post.content || '');
      }, 300);

      if (post.file) {
        setFile({
          uri: post.file,
          type: post.file.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
          name: post.original_name || `file_${Date.now()}`,
        });
      }
    }
  }, [post]);

  const isLocalFile = (file: FileData | null) => {
    if (!file) return false;
    return file.uri.startsWith('file://');
  };

  const getFileType = (file: FileData | null) => {
    if (!file) return null;
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'file';
  };

  const getFileUri = (file: FileData | null) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.uri;
    }
    return getSupabaseFileUrl(file.uri);
  };

  const onPick = async (isImage: boolean) => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Toast.show({ type: 'error', text1: 'Quyền bị từ chối' });
      return;
    }

    const mediaType = isImage ? 'photo' : 'video';
    const response = await launchImageLibrary({ mediaType, quality: 0.8 });

    if (response.didCancel) return;

    const asset = response.assets?.[0];
    if (!asset?.uri) return;

    setFile({
      uri: asset.uri,
      type: asset.type || (isImage ? 'image/jpeg' : 'video/mp4'),
      name: asset.fileName || `${isImage ? 'image' : 'video'}_${Date.now()}`,
      fileSize: asset.fileSize,
    });
  };

  const onSubmit = async () => {
    if (!bodyRef.current && !file) {
      Alert.alert('Post', 'Vui lòng nhập nội dung hoặc chọn file');
      return;
    }

    setLoading(true);
    try {
      let fileData = null;

      if (file && isLocalFile(file)) {
        const fileBase64 = await convertFileToBase64(file.uri);
        fileData = {
          fileBase64,
          fileName: file.name,
          mimeType: file.type,
        };
      } else if (file && !isLocalFile(file)) {
        fileData = {
          uri: file.uri,
          mimeType: file.type,
          fileName: file.name,
        };
      }

      const postData: CreatePostData & { id: number } = {
        id: post.id,
        content: bodyRef.current,
        userId: user?.id,
        file: fileData,
      };

      const res = await updatePost(postData);

      if (res.success) {
        Toast.show({ type: 'success', text1: 'Cập nhật thành công' });
        navigation.goBack();
      } else {
        Alert.alert(
          'Post',
          res.message || 'Có lỗi xảy ra khi cập nhật bài viết',
        );
      }
    } catch (err) {
      Alert.alert('Post', 'Có lỗi xảy ra khi cập nhật bài viết');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header với gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Chỉnh sửa bài viết</Text>
          </View>

          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User Info */}
          <View style={styles.userSection}>
            <Avatar
              uri={getUserImageSrc(user?.avatar)}
              size={hp(6.5)}
              rounded={theme.radius.xxl * 100}
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user?.nick_name}</Text>
              <View style={styles.publicBadge}>
                <Text style={styles.publicText}>Công khai</Text>
              </View>
            </View>
          </View>

          {/* Text Editor */}
          <View style={styles.editorSection}>
            <RichTextEditor
              ref={editorRef}
              onChange={val => (bodyRef.current = val)}
            />
          </View>

          {/* File Preview */}
          {file && (
            <View style={styles.filePreview}>
              {getFileType(file) === 'video' ? (
                <Video
                  style={styles.mediaContent}
                  source={{ uri: getFileUri(file) || '' }}
                  resizeMode="cover"
                  paused={true}
                />
              ) : (
                <Image
                  source={{ uri: getFileUri(file) || '' }}
                  resizeMode="cover"
                  style={styles.mediaContent}
                />
              )}
              <Pressable
                style={styles.removeButton}
                onPress={() => setFile(null)}
              >
                <Trash size={18} color="white" />
              </Pressable>
            </View>
          )}

          {/* Media Picker */}
          <View style={styles.mediaSection}>
            <Text style={styles.mediaSectionTitle}>
              Thêm vào bài viết của bạn
            </Text>
            <View style={styles.mediaButtons}>
              <TouchableOpacity
                style={styles.mediaButton}
                onPress={() => onPick(true)}
                activeOpacity={0.8}
              >
                <FileImage size={24} color="#667eea" />
                <Text style={styles.mediaButtonText}>Ảnh</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mediaButton}
                onPress={() => onPick(false)}
                activeOpacity={0.8}
              >
                <VideoIcon size={24} color="#667eea" />
                <Text style={styles.mediaButtonText}>Video</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <Button
            buttonStyle={styles.submitButton}
            title={'Cập nhật bài viết'}
            loading={loading}
            hasShadow={true}
            onPress={onSubmit}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerGradient: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(20),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerRight: {
    width: moderateScale(40),
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: verticalScale(-12),
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(20),
    paddingBottom: verticalScale(100),
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(24),
    padding: scale(16),
    backgroundColor: '#f8faff',
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  userInfo: {
    marginLeft: scale(12),
    flex: 1,
  },
  username: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: verticalScale(4),
  },
  publicBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
    alignSelf: 'flex-start',
  },
  publicText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#ffffff',
  },
  editorSection: {
    marginBottom: verticalScale(24),
    minHeight: verticalScale(120),
  },
  filePreview: {
    height: verticalScale(220), // Thay thế hp(30)
    width: '100%',
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    marginBottom: verticalScale(24),
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  mediaContent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: scale(12),
    right: scale(12),
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaSection: {
    backgroundColor: '#f8faff',
    borderRadius: moderateScale(16),
    padding: scale(20),
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  mediaSectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#374151',
    marginBottom: verticalScale(16),
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: scale(16),
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#e0e7ff',
    elevation: 2,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mediaButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#667eea',
    marginLeft: scale(8),
  },
  submitSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: scale(20),
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  submitButton: {
    height: verticalScale(48), // Thay thế hp(6.2)
    backgroundColor: '#667eea',
    borderRadius: moderateScale(16),
  },
});
