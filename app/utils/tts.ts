import Tts from 'react-native-tts';

export const speakText = (text: string) => {
  Tts.setDefaultLanguage('en-US');
  Tts.setDefaultRate(0.5);
  Tts.speak(text);
};

export const stopSpeaking = () => {
  Tts.stop();
};