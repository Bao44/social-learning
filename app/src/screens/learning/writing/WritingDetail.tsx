import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Animated,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Snowflake, CircleEqual, ArrowLeft, Menu, FileText } from "lucide-react-native";
import LinearGradient from 'react-native-linear-gradient';
import Toast from "react-native-toast-message";
import useAuth from "../../../../hooks/useAuth";

// Import API
import {
    getWritingParagraphById,
    getHistorySubmitWritingParagraphByUserAndParagraph,
    submitWritingParagraphExercise,
    feedbackWritingParagraphExercise,
} from "../../../api/learning/writing/route";
import { getScoreUserByUserId } from '../../../api/learning/score/route';

// Import components
import FloatingMenu from './components/FloatingMenu';
import WritingHistoryModal from './components/HistoryModal';
import WritingProgressModal from './components/ProgressModal';
import WritingSubmitModal from './components/SubmitModal';
import FeedbackModal from "./components/FeedbackModal";
import SubmittingModal from "./components/SubmittingModal";

type DetailRouteParams = { id: number; };
type DetailRouteProp = RouteProp<{ params: DetailRouteParams }, 'params'>;

export default function ExerciseDetailScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<DetailRouteProp>();
    const { user } = useAuth();
    const id = Number(route.params?.id ?? 0);

    const [exercise, setExercise] = useState<any>(null);
    const [inputValue, setInputValue] = useState("");
    const [history, setHistory] = useState<any[]>([]);
    const [score, setScore] = useState<any>(null);
    const [progress, setProgress] = useState<any>(null);
    const [pageLoading, setPageLoading] = useState(true);

    // Feedback/Submit states
    const [feedback, setFeedback] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingFeedback, setIsFetchingFeedback] = useState(false);
    const [submitResult, setSubmitResult] = useState({ score: 0, snowflake: 0 });

    // Modal states
    const [showTopMenu, setShowTopMenu] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id || !user) return;
            setPageLoading(true);
            try {
                const [data, userScore, hist] = await Promise.all([
                    getWritingParagraphById(id),
                    getScoreUserByUserId(user.id),
                    getHistorySubmitWritingParagraphByUserAndParagraph(user.id, String(id))
                ]);

                setExercise(data);
                setScore(userScore.data);
                setHistory(hist);
                computeProgress(hist);

            } catch (error) {
                console.error("Failed to load exercise data", error);
                Toast.show({ type: 'error', text1: 'Lỗi tải bài tập' });
            } finally {
                setPageLoading(false);
            }
        };
        fetchData();
    }, [id, user]);

    // (computeProgress function giữ nguyên)
    const computeProgress = (hist: any[]) => {
        if (hist.length === 0) {
            setProgress({ submit_times: 0, score: 0, isCorrect: false });
            return;
        }
        const bestScore = Math.max(
            ...hist.map((h) => {
                try {
                    return JSON.parse(h.feedback)?.score ?? 0;
                } catch { return 0; }
            })
        );
        setProgress({
            submit_times: hist.length,
            score: bestScore,
            isCorrect: bestScore >= 80
        });
    };

    // (handleSubmit function giữ nguyên)
    const handleSubmit = async () => {
        if (!exercise) return;
        setIsSubmitting(true);
        try {
            const res = await submitWritingParagraphExercise(user.id, exercise.id, inputValue);
            setFeedback(res.data.feedback);
            setSubmitResult({ score: res.data.score, snowflake: res.data.snowflake });

            setScore((s: any) => ({
                ...s,
                practice_score: s.practice_score + res.data.score,
                number_snowflake: s.number_snowflake + res.data.snowflake,
            }));

            const hist = await getHistorySubmitWritingParagraphByUserAndParagraph(user.id, String(exercise.id));
            setHistory(hist);
            computeProgress(hist);

            setShowSubmitModal(true);
        } catch (err) {
            console.error(err);
            Toast.show({ type: 'error', text1: 'Lỗi khi nộp bài' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // (handleFeedback function giữ nguyên)
    const handleFeedback = async () => {
        if (!exercise) return;
        if (score.number_snowflake < 2) {
            Toast.show({ type: "error", text1: "Không đủ Snowflake!" });
            return;
        }
        setIsFetchingFeedback(true);
        try {
            const res = await feedbackWritingParagraphExercise(user.id, exercise.id, inputValue);
            setFeedback(res.data);
            setScore((s: any) => ({
                ...s,
                number_snowflake: Math.max(0, s.number_snowflake - 2),
            }));
            setShowFeedbackModal(true);
        } catch (err) {
            console.error(err);
            Toast.show({ type: 'error', text1: 'Lỗi khi lấy gợi ý' });
        } finally {
            setIsFetchingFeedback(false);
        }
    };

    // (handleHistorySelect function giữ nguyên)
    const handleHistorySelect = (historyItem: any) => {
        if (!historyItem) return;
        let parsedFeedback = null;
        try {
            parsedFeedback = historyItem.feedback ? historyItem.feedback : null;
            
        } catch { }

        setInputValue(historyItem.content_submit);
        setFeedback(parsedFeedback);
        setShowHistoryModal(false);
        if (parsedFeedback) {
            setShowFeedbackModal(true);
        }
    };

    const handleDictionary = () => {
        Alert.alert("Tính năng sắp ra mắt", "Từ điển đang được phát triển.");
    };

    if (pageLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#8A2BE2" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                {/* Header Gradient */}
                <LinearGradient
                    colors={['#FF6B6B', '#FF8E8E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-5 pt-3"
                >
                    <View className='flex flex-row justify-between items-center'>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className='w-10 h-10 rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center'
                            activeOpacity={0.8}
                        >
                            <ArrowLeft size={24} color="#fff" />
                        </TouchableOpacity>

                        <View className='flex-row items-center justify-end gap-3'>
                            <View className='flex flex-row items-center justify-center gap-2 bg-white/20 px-3 py-1 rounded-full'>
                                <Text className='text-[#0000FF] text-lg font-bold'>{score?.number_snowflake || 0}</Text>
                                <Snowflake size={18} color={"#0000FF"} />
                            </View>
                            <View className='flex flex-row items-center justify-center gap-2 bg-white/20 px-3 py-1 rounded-full'>
                                <Text className='text-[#FFFF00] text-lg font-bold'>{score?.practice_score || 0}</Text>
                                <CircleEqual size={18} color={"#FFFF00"} />
                            </View>
                        </View>

                        <View>
                            <TouchableOpacity
                                onPress={() => setShowTopMenu((prev) => !prev)}
                                activeOpacity={0.8}
                                className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center"
                            >
                                <Menu size={24} color="#fff" />
                            </TouchableOpacity>

                            {showTopMenu && (
                                <View className="absolute top-12 right-0 bg-white rounded-lg shadow-lg w-48 z-50">
                                    <TouchableOpacity
                                        className="p-3 border-b border-gray-100 flex-row items-center"
                                        onPress={() => { setShowTopMenu(false); setShowHistoryModal(true); }}
                                    >
                                        <Text>📜 Lịch sử</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="p-3 flex-row items-center"
                                        onPress={() => { setShowTopMenu(false); setShowProgressModal(true); }}
                                    >
                                        <Text>📈 Tiến độ</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </LinearGradient>

                {/* Content */}
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                >
                    <View className="bg-blue-100 p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
                        <View className="flex-col items-center mb-3 gap-2">
                            <FileText size={20} color="#8A2BE2" />
                            <Text className="text-lg font-bold text-gray-900 ml-2 text-center">
                                {exercise?.title ?? "Loading..."}
                            </Text>
                        </View>
                        <Text className="text-gray-700 text-base mb-2 leading-6">
                            {exercise?.content_vi}
                        </Text>
                    </View>

                    <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
                        <TextInput
                            className="border border-gray-300 rounded-xl p-3 text-base text-gray-800"
                            placeholder="Nhập đoạn văn của bạn..."
                            multiline
                            value={inputValue}
                            onChangeText={setInputValue}
                            style={{ minHeight: 200, textAlignVertical: 'top' }}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* FAB Menu */}
            <FloatingMenu
                onCheck={handleFeedback}
                onHint={handleDictionary}
                onSubmit={handleSubmit}
            />

            {/* Modals */}
            <WritingHistoryModal
                visible={showHistoryModal}
                onClose={() => setShowHistoryModal(false)}
                history={history}
                handle={handleHistorySelect}
            />

            <WritingProgressModal
                visible={showProgressModal}
                onClose={() => setShowProgressModal(false)}
                progress={progress}
            />

            <WritingSubmitModal
                visible={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                practice_score={submitResult.score}
                snowflake={submitResult.snowflake}
            />

            <FeedbackModal
                visible={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
                feedback={feedback}
                loading={isFetchingFeedback}
            />

            <SubmittingModal visible={isSubmitting} />
        </SafeAreaView>
    );
}