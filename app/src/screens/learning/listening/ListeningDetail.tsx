import React, { useEffect, useState, useRef } from 'react'; // Đã cập nhật
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  FileText,
  Snowflake,
  CircleEqual,
  History,
  Menu,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { listeningService } from '../../../api/learning/listening/route';
import useAuth from '../../../../hooks/useAuth';
import FloatingMenu from './components/FloatingMenu';
import HistoryModal from './components/HistoryModal';
import ProgressModal from './components/ProgressModal';
import SubmitModal from './components/SubmitModal';
import SubmittingModal from "./components/SubmittingModal";
import { getScoreUserByUserId } from '../../../api/learning/score/route';

// --- Imports cho audio player ---
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
// ---------------------------------

export default function ListeningDetail() {
  const route = useRoute();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const { id } = route.params as { id: string };

  // --- State gốc ---
  const [exercise, setExercise] = useState<any>(null);
  const [score, setScore] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checkResult, setCheckResult] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resSubmit, setResSubmit] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([]);
  const [showTopMenu, setShowTopMenu] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ correct: number, total: number }>({ correct: 0, total: 0 });

  // --- State cho Audio Player ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false); // Quan trọng: để xử lý việc tua

  // --- Ref cho Audio Player ---
  const audioRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listeningService.getListeningExerciseById(id);
        setExercise(data);

        if (user) {
          const scoreData = await getScoreUserByUserId(user?.id) // Sửa lại tên biến
          setScore(scoreData.data) // Sửa lại tên biến

          const prog = await listeningService.getUserProgress(user.id, id as string)
          setProgress(prog)

          const hist = await listeningService.getSubmissionHistory(user.id, data.id);
          setHistory(hist);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Lỗi', 'Không thể tải bài nghe');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, isSubmitting]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  if (!exercise) {
    return (
      <Text style={{ textAlign: 'center', marginTop: 40 }}>
        Không tìm thấy bài nghe
      </Text>
    );
  }

  // --- Các hàm xử lý (Giữ nguyên) ---
  const hiddenMap: Record<number, string> = {};
  exercise.wordHidden?.forEach((wh: any) => {
    hiddenMap[wh.position] = wh.answer;
  });

  const words = exercise.text_content.split(/\s+/);

  const handleCheckAnswers = () => {
    const result: Record<number, boolean> = {}
    Object.keys(hiddenMap).forEach((pos) => {
      const position = parseInt(pos)
      const correct = hiddenMap[position].toLowerCase()
      const userAns = (answers[position] || "").toLowerCase()
      result[position] = userAns === correct
    })
    setCheckResult(result)
  }

  const handleSuggestHint = () => {
    const unansweredPositions = Object.keys(hiddenMap).filter((pos) => !answers[parseInt(pos)]);
    if (unansweredPositions.length === 0) return;

    const randomPos = unansweredPositions[Math.floor(Math.random() * unansweredPositions.length)];
    const correctWord = hiddenMap[parseInt(randomPos)];

    setAnswers(prev => ({ ...prev, [parseInt(randomPos)]: correctWord }));
    setCheckResult(prev => ({ ...prev, [parseInt(randomPos)]: true }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Tạm dừng âm thanh khi nộp bài
    setIsPlaying(false);

    const wordAnswers = exercise.wordHidden.map((wh: any) => ({
      word_hidden_id: wh.id,
      position: wh.position,
      answer_input: answers[wh.position] || "",
      is_correct:
        (answers[wh.position] || "").trim().toLowerCase() ===
        wh.answer.trim().toLowerCase(),
    }));

    try {
      const res = await listeningService.submitListeningResults(
        user?.id,
        exercise?.id,
        wordAnswers
      );

      setResSubmit(res)

      const correctCount = wordAnswers.filter((a: { is_correct: boolean }) => a.is_correct).length;
      setSubmitResult({ correct: correctCount, total: wordAnswers.length });

      const newCheckResult: Record<number, boolean> = {};
      wordAnswers.forEach((ans: { position: number; is_correct: boolean }) => {
        newCheckResult[ans.position] = ans.is_correct;
      });
      setCheckResult(newCheckResult);

      setShowSubmitModal(true);
    } catch (error) {
      console.error("Error submitting results:", error);
      Alert.alert("Lỗi", "Không thể nộp bài. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHistory = (historyItem: any) => {
    if (!historyItem || !historyItem.answers) {
      console.error("Dữ liệu lịch sử không hợp lệ");
      return;
    }
    const wordIdToPositionMap = new Map(
      exercise.wordHidden.map((wh: any) => [wh.id, wh.position])
    );
    const historicalAnswers: Record<number, string> = {};
    const historicalCheckResult: Record<number, boolean> = {};

    for (const ans of historyItem.answers) {
      const position = wordIdToPositionMap.get(ans.word_hidden_id);
      if (typeof position === "number") {
        historicalAnswers[position] = ans.answer_input;
        historicalCheckResult[position] = ans.is_correct;
      }
    }
    setAnswers(historicalAnswers);
    setCheckResult(historicalCheckResult);
    setShowHistoryModal(false)
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Component Video để xử lý âm thanh (ẩn) --- */}
      {exercise?.audio_url && ( // <-- Thay 'audio_url' bằng tên trường của bạn
        <Video
          ref={audioRef}
          source={{ uri: exercise.audio_url }} // <-- Thay 'audio_url' bằng tên trường của bạn
          paused={!isPlaying}
          playInBackground={true}
          // Khi audio được tải
          onLoad={(data) => {
            setDuration(data.duration);
            setIsLoadingAudio(false);
          }}
          // Khi audio đang phát (cập nhật tiến trình)
          onProgress={(data) => {
            // Chỉ cập nhật currentTime nếu người dùng KHÔNG đang kéo
            if (!isSeeking) {
              setCurrentTime(data.currentTime);
            }
          }}
          // Khi audio phát xong
          onEnd={() => {
            setIsPlaying(false);
            audioRef.current?.seek(0);
            setCurrentTime(0);
          }}
          resizeMode="none"
          style={{ height: 0, width: 0 }} // Ẩn component
        />
      )}
      {/* ---------------------------------------------------- */}

      {/* Header với gradient (Giữ nguyên) */}
      <LinearGradient
        colors={['#4ECDC4', '#6DD5DB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View className='flex flex-row justify-between items-center'>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className='w-10 h-10 rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center'
            activeOpacity={0.8}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>

          <View className='flex-row items-center justify-end gap-10'>
            <View className='flex flex-row items-center justify-center gap-2'>
              <Text className='text-[#0000FF] text-xl'>{score?.number_snowflake || 0}</Text>
              <Snowflake className="h-5 w-5" color={"#0000FF"} />
            </View>
            <View className='flex flex-row items-center justify-center gap-2'>
              <Text className='text-[#FFFF00] text-xl'>{score?.practice_score || 0}</Text>
              <CircleEqual className="h-5 w-5" color={"#FFFF00"} />
            </View>
          </View>

          {/* Nút menu (Giữ nguyên) */}
          <View style={{ position: 'relative' }}>
            <TouchableOpacity
              onPress={() => setShowTopMenu((prev) => !prev)}
              activeOpacity={0.8}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
            >
              <Menu size={24} color="#fff" />
            </TouchableOpacity>
            {showTopMenu && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setShowTopMenu(false);
                    setShowHistoryModal(true);
                  }}
                >
                  <Text style={styles.dropdownText}>📜 History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setShowTopMenu(false);
                    setShowProgressModal(true);
                  }}
                >
                  <Text style={styles.dropdownText}>📈 Progress</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {/* --- Cập nhật Audio Player --- */}
        <View style={styles.audioContainer}>
          <View style={styles.audioHeader}>
            <Volume2 size={20} color="#4ECDC4" />
            <Text style={styles.audioTitle}>Audio Player</Text>
          </View>

          {/* --- Thanh tua (Slider) --- */}
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            minimumTrackTintColor="#4ECDC4"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor="#4ECDC4"
            disabled={isLoadingAudio || duration === 0}
            // Khi bắt đầu kéo
            onSlidingStart={() => {
              setIsSeeking(true);
            }}
            // Khi đang kéo (cập nhật UI ngay lập tức)
            onValueChange={(value) => {
              setCurrentTime(value);
            }}
            // Khi thả tay (tua audio)
            onSlidingComplete={(value) => {
              audioRef.current?.seek(value);
              setIsSeeking(false);
            }}
          />
          {/* --- Hiển thị thời gian --- */}
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
          {/* ------------------------- */}

          <View style={styles.audioControls}>
            <TouchableOpacity
              style={styles.audioButton}
              activeOpacity={0.8}
              onPress={() => setIsPlaying(!isPlaying)}
              disabled={isLoadingAudio || duration === 0}
            >
              {isPlaying ? (
                <Pause size={24} color="#fff" />
              ) : (
                <Play size={24} color="#fff" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.audioButtonSecondary}
              activeOpacity={0.8}
              onPress={() => {
                audioRef.current?.seek(0)
                setCurrentTime(0);
              }}
              disabled={isLoadingAudio || duration === 0}
            >
              <RotateCcw size={20} color="#4ECDC4" />
            </TouchableOpacity>
          </View>
        </View>
        {/* ----------------------------- */}

        {/* ScrollView (Giữ nguyên) */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Text with blanks (Giữ nguyên) */}
          <View style={styles.textContainer}>
            <View style={styles.textHeader}>
              <FileText size={20} color="#4ECDC4" />
              <Text style={styles.textTitle}>{exercise.title_vi}</Text>
            </View>

            <View style={styles.textContent}>
              {words.map((word: string, idx: number) => {
                const position = idx + 1;
                const correctAnswer = hiddenMap[position];
                const isCorrect = checkResult[position];
                const userAnswer = answers[position] || '';

                if (correctAnswer) {
                  return (
                    <View key={idx} style={styles.inputWrapper}>
                      <TextInput
                        maxLength={correctAnswer.length}
                        placeholder={"_ ".repeat(correctAnswer.length)}
                        className={`text-[16px] border-b-2 text-center bg-white px-1 py-0.5 rounded-sm tracking-widest
                      ${isCorrect === true
                            ? "border-green-500 text-green-500"
                            : isCorrect === false
                              ? "border-red-500 text-red-500"
                              : "border-gray-400 text-blue-700"
                          }`}
                        value={userAnswer}
                        onChangeText={text =>
                          setAnswers({ ...answers, [position]: text })
                        }
                      />
                    </View>
                  );
                } else {
                  return (
                    <Text key={idx} style={styles.wordText}>
                      {word}{' '}
                    </Text>
                  );
                }
              })}
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>


      {/* Floating Menu (Giữ nguyên) */}
      <FloatingMenu
        onCheck={handleCheckAnswers}
        onHint={handleSuggestHint}
        onSubmit={handleSubmit}
      />

      {/* Modals (Giữ nguyên) */}
      <HistoryModal
        visible={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={history}
        handle={handleHistory}
      />

      <ProgressModal
        visible={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        progress={progress}
      />

      <SubmittingModal visible={isSubmitting} />

      <SubmitModal
        visible={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        correctCount={submitResult.correct}
        total={submitResult.total}
        practice_score={resSubmit?.score}
        snowflake={resSubmit?.snowflake}
      />
    </SafeAreaView>
  );
}

// --- Hàm tiện ích để format thời gian ---
const formatTime = (seconds: number) => {
  // Xử lý trường hợp duration chưa được tải (NaN)
  if (isNaN(seconds) || seconds < 0) return '00:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
};
// ----------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8fffe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  spinner: {
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  loadingDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 12, // Điều chỉnh nếu dùng SafeAreaView
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: -12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Thêm khoảng đệm cho FloatingMenu
  },
  audioContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  audioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, // Thêm khoảng cách cho Slider
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 12, // Thêm khoảng cách với thanh Slider
  },
  audioButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4ECDC4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  audioButtonSecondary: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0fdfa',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  // --- STYLE MỚI CHO AUDIO TIME ---
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: -10, // Kéo lên cho gần Slider
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
    fontVariant: ['tabular-nums'], // Giữ độ rộng số ổn định
  },
  // ----------------------------------
  textContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  textHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  textTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
    textAlign: 'center',
  },
  textContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    lineHeight: 28, // Quan trọng để các input thẳng hàng
  },
  inputWrapper: {
    position: 'relative',
    marginHorizontal: 2,
    marginVertical: 4,
  },
  // Style này đã bị ghi đè bởi className,
  // nhưng giữ lại để tham khảo nếu bạn gỡ Tailwind
  textInput: {
    borderBottomWidth: 2,
    borderColor: '#d1d5db',
    minWidth: 60,
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  resultIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 2,
  },
  correctAnswer: {
    position: 'absolute',
    top: 30, // Điều chỉnh vị trí của đáp án gợi ý
    left: 0,
    right: 0,
    fontSize: 12,
    color: '#ef4444',
    textAlign: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  wordText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 28,
    marginHorizontal: 2,
  },
  resultsContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
  },
  bottomSpacing: {
    height: 32, // Khoảng trống ở cuối ScrollView
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  resetButtonText: {
    color: '#6b7280',
    fontWeight: '600',
    marginLeft: 8,
  },
  continueButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  continueButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 48, // Tăng lên 48px để có khoảng hở với nút Menu
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 150,
    zIndex: 999, // Đảm bảo menu nổi lên trên
  },
  dropdownItem: {
    paddingVertical: 12, // Tăng padding
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  }
});