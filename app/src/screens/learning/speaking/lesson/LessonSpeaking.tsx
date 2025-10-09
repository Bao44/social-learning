// import React, { useEffect, useState } from "react";
// import { View, Text, Button, PermissionsAndroid, Platform } from "react-native";
// import Voice from "@react-native-voice/voice";

// async function requestMicPermission() {
//   const granted = await PermissionsAndroid.request(
//     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//     {
//       title: 'Permission to use microphone',
//       message: 'App needs access to your microphone to recognize speech.',
//       buttonNeutral: 'Ask Me Later',
//       buttonNegative: 'Cancel',
//       buttonPositive: 'OK',
//     },
//   );
//   return granted === PermissionsAndroid.RESULTS.GRANTED;
// }


// export default function LessonSpeaking() {
//   const [text, setText] = useState("");
//   const [isListening, setIsListening] = useState(false);

//   useEffect(() => {
//     console.log("Voice module loaded:", Voice);

//     Voice.onSpeechStart = () => console.log("Speech started");
//     Voice.onSpeechEnd = () => {
//       console.log("Speech ended");
//       setIsListening(false);
//     };
//     Voice.onSpeechResults = (event) => {
//       console.log("Speech results:", event.value);
//       setText(event.value?.[0] || "");
//     };
//     Voice.onSpeechError = (error) => console.log("Speech error:", error);

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const requestPermission = async () => {
//     if (Platform.OS === "android") {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     return true;
//   };

//   const startListening = async () => {
//     const hasPermission = await requestPermission();
//     if (!hasPermission) {
//       console.warn("Permission denied");
//       return;
//     }

//     try {
//       console.log("Starting voice recognition...");
//       await Voice.start("vi-VN");
//       setIsListening(true);
//     } catch (e) {
//       console.error("Error starting voice:", e);
//     }
//   };

//   Voice.onSpeechError = (error:any) => {
//   console.log("Speech error:", error);
//   if (error.error.code === '7') {
//     setText("No speech recognized. Please try again.");
//   } else if (error.error.code === '5') {
//     setText("Client side error. Check microphone or permissions.");
//   }
// };

//   const stopListening = async () => {
//     try {
//       await Voice.stop();
//       setIsListening(false);
//     } catch (e) {
//       console.error("Error stopping voice:", e);
//     }
//   };

//   return (
//     <View className="flex-1 justify-center items-center bg-white p-4">
//       <Text className="text-xl font-bold mb-4">Voice Recognition Test</Text>
//       <Text className="text-base mb-6 text-gray-700">{text || "..."}</Text>
//       <Button
//         title={isListening ? "Stop" : "Start"}
//         onPress={isListening ? stopListening : startListening}
//       />
//     </View>
//   );
// }

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Voice from '@react-native-voice/voice';

export default function LessonSpeaking() {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Cleanup trước khi setup
    Voice.destroy().then(() => {
      Voice.removeAllListeners();

      Voice.onSpeechStart = () => {
        console.log('Speech started');
        setError('');
      };

      Voice.onSpeechEnd = () => {
        console.log('Speech ended');
        setIsListening(false);
      };

      Voice.onSpeechResults = event => {
        console.log('Speech results:', event.value);
        if (event.value && event.value.length > 0) {
          setText(event.value[0]);
        }
      };

      // Xử lý partial results để phản hồi nhanh hơn
      Voice.onSpeechPartialResults = event => {
        console.log('Partial results:', event.value);
        if (event.value && event.value.length > 0) {
          setText(event.value[0]);
        }
      };

      Voice.onSpeechError = (error: any) => {
        console.log('Speech error:', error);
        setIsListening(false);

        if (error.error.code === '7') {
          setError('Không nhận diện được giọng nói. Hãy nói rõ hơn.');
        } else if (error.error.code === '5') {
          setError('Lỗi hệ thống. Vui lòng thử lại.');
        } else {
          setError(`Lỗi: ${error.error.message}`);
        }
      };
    });

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Quyền sử dụng microphone',
          message:
            'Ứng dụng cần quyền truy cập microphone để nhận diện giọng nói.',
          buttonNeutral: 'Hỏi lại sau',
          buttonNegative: 'Hủy',
          buttonPositive: 'Đồng ý',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const startListening = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('Lỗi', 'Cần cấp quyền microphone để sử dụng tính năng này');
      return;
    }

    try {
      // Reset state trước khi bắt đầu
      setText('');
      setError('');

      // Stop bất kỳ session nào đang chạy
      await Voice.stop();
      await Voice.cancel();

      // Đợi một chút trước khi start
      setTimeout(async () => {
        await Voice.start('en-US', {
          EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 10000,
          EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 3000,
        });
        setIsListening(true);
      }, 100);
    } catch (e) {
      console.error('Error starting voice:', e);
      setError('Không thể bắt đầu nhận diện giọng nói');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error('Error stopping voice:', e);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-xl font-bold mb-4">Voice Recognition Test</Text>
      <Text className="text-base mb-6 text-gray-700">
        {text || 'Nhấn Start và nói...'}
      </Text>
      {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}
      <Button
        title={isListening ? 'Stop' : 'Start'}
        onPress={isListening ? stopListening : startListening}
        color={isListening ? '#ff0000' : '#007AFF'}
      />
      {isListening && (
        <Text className="mt-4 text-green-600">🎤 Đang nghe...</Text>
      )}
    </View>
  );
}
