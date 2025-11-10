import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
// Import thư viện Conference (đúng như bạn muốn)
import ZegoUIKitPrebuiltVideoConference from '@zegocloud/zego-uikit-prebuilt-video-conference-rn';

// (KHÔNG import ONE_ON_ONE... configs từ thư viện 'call' nữa)

import Toast from 'react-native-toast-message';
import useAuth from '../../../hooks/useAuth';
import { getSocket } from '../../../socket/socketClient';

// (Đọc APP_ID và APP_SIGN giữ nguyên)
const APP_ID = 615480249;
const APP_SIGN = '6591e01fe5241fdfbd2262b4bfcd7ebd';

export default function RoomCall() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { user } = useAuth();

  const { roomId, callType } = route.params;

  const appID = Number(APP_ID) || 0;
  const appSign = APP_SIGN || '';

  // (useEffect xử lý socket giữ nguyên - không có lỗi)
  useEffect(() => {
    if (!user || !roomId) {
      navigation.goBack();
      return;
    }
    const socket = getSocket();
    socket.emit('joinCallRoom', roomId.toString());
    const onCallDeclined = ({ declinerId }: any) => {
      Toast.show({
        type: 'error',
        text1: 'Người dùng đã từ chối cuộc gọi.',
      });
      navigation.goBack();
    };
    socket.on('callDeclined', onCallDeclined);
    return () => {
      socket.off('callDeclined', onCallDeclined);
      socket.emit('leaveCallRoom', roomId.toString());
    };
  }, [roomId, user, navigation]);

  // (Phần kiểm tra lỗi giữ nguyên)
  if (!user || !roomId || !appID || !appSign) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Lỗi cấu hình cuộc gọi.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.errorButton}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltVideoConference
        appID={appID}
        appSign={appSign}
        userID={user.id}
        userName={user.name}
        // --- ⚠️ FIX 1: Đổi tên 'callID' thành 'conferenceID' ---
        conferenceID={roomId.toString()}
        config={{
          // --- ⚠️ FIX 2: Xóa bỏ các biến config không hợp lệ ---
          // (Đã xóa: ...ONE_ON_ONE_VIDEO_CALL_CONFIG)

          // Các cài đặt này được chấp nhận trực tiếp
          turnOnCameraWhenJoining: callType === 'video',
          turnOnMicrophoneWhenJoining: true,
          useSpeakerWhenJoining: true,

          // Xử lý khi rời phòng (onLeave là đúng cho Conference)
          onLeave: () => {
            navigation.goBack();
          },

          // (onHangUp không phải là prop chính ở đây,
          // onLeave sẽ xử lý việc rời phòng)
        }}
      />
    </View>
  );
}

// (Stylesheet giữ nguyên)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  errorButton: {
    color: '#3478f6',
    fontSize: 16,
  },
});
