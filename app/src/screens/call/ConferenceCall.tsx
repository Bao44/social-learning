import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import ZegoUIKitPrebuiltVideoConference from '@zegocloud/zego-uikit-prebuilt-video-conference-rn';
import Toast from 'react-native-toast-message';
import useAuth from '../../../hooks/useAuth';
import { getSocket } from '../../../socket/socketClient';

export default function ConferenceCall(props: any) {
  const { route, navigation } = props;
  const { params } = route;
  const { userID, conferenceID } = params;

  const { user } = useAuth();

  useEffect(() => {
    const socket = getSocket();

    socket.emit('joinCallRoom', conferenceID);

    const onCallDeclined = ({ declinerId }: { declinerId: string }) => {
      Toast.show({
        type: 'error',
        text1: 'Người dùng đã từ chối cuộc gọi.',
      });
      navigation.goBack();
    };

    socket.on('callDeclined', onCallDeclined);

    // Hàm cleanup
    return () => {
      socket.off('callDeclined', onCallDeclined);
      socket.emit('leaveCallRoom', conferenceID);
    };
  }, [conferenceID, navigation]);

  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltVideoConference
        appID={process.env.ZEGOCLOUD_APP_ID}
        appSign={process.env.ZEGOCLOUD_SERVER_SECRET}
        userID={userID}
        userName={user?.name || userID}
        conferenceID={conferenceID}
        config={{
          onLeave: () => {
            navigation.goBack();
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
