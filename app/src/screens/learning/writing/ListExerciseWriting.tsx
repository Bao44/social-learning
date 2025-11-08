import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    // 2. Xóa Modal, X
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, BookText, Filter } from 'lucide-react-native';

// Import API client
import { getAllTopics, getLevelBySlug, getTypeParagraphBySlug } from '../../../api/learning/route';
import { getListWritingParagraphsByTypeLevelTypeParagraph } from '../../../api/learning/writing/route';

// Import Card
import CardWritingExercise from './components/CardExercise';

import TopicFilterModal from './components/TopicFilterModal';

type PageParams = { type: string; level: string; typeParagraph: string; };
type PageRouteProp = RouteProp<{ params: PageParams }, 'params'>;
interface WritingExercise { id: string; title: string; content_vi: string; label: string; progress: number; topic_id: number; };
type Topic = { id: number; icon: { name: string; color: string; }; name_vi: string; name_en: string; slug: string; description_vi: string; description_en: string; };

export default function ListExerciseWriting() {
    const navigation = useNavigation<any>();
    const route = useRoute<PageRouteProp>();
    const { type, level, typeParagraph } = route.params;

    const [writingExercises, setWritingExercises] = useState<WritingExercise[]>([]);
    const [levelExerciseName, setLevelExerciseName] = useState<string>("");
    const [typeParagraphsName, setTypeParagraphsName] = useState<string>("");
    const [topicFilters, setTopicFilters] = useState<Topic[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<{ id: number; slug: string; name_vi: string }>({ id: 0, slug: 'all', name_vi: 'Tất cả chủ đề' });
    const [selectedTypeParagraph, setSelectedTypeParagraph] = useState<string>(typeParagraph as string || "all");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

    // useEffect (giữ nguyên, không đổi)
    useEffect(() => {
        const fetchData = async () => {
            if (typeof type === "string" && typeof level === "string") {
                setIsLoading(true);
                try {
                    if (topicFilters.length === 0) {
                        const [levelNameData, topicsData, typeParagraphsName] = await Promise.all([
                            getLevelBySlug(level),
                            getAllTopics(),
                            getTypeParagraphBySlug(typeParagraph as string),
                        ]);
                        setLevelExerciseName(levelNameData ? levelNameData.name_vi : "");
                        setTypeParagraphsName(typeParagraphsName ? typeParagraphsName.name_vi : "");
                        if (Array.isArray(topicsData)) {
                            setTopicFilters(topicsData);
                        }
                    }
                    const data = await getListWritingParagraphsByTypeLevelTypeParagraph(type, level, selectedTypeParagraph);
                    setWritingExercises(data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchData();
    }, [type, level, selectedTypeParagraph]);

    const handleStartWritingExercise = (exerciseId: string) => {
        navigation.navigate('WritingDetail', { id: exerciseId });
    };

    // Hàm này giờ chỉ xử lý logic, không render
    const handleSelectTopic = (arg: { id: number; slug: string; name_vi: string } | 'all') => {
        if (arg === 'all') {
            setSelectedTopic({ id: 0, slug: 'all', name_vi: 'Tất cả chủ đề' });
        } else {
            setSelectedTopic({ id: arg.id, slug: arg.slug, name_vi: arg.name_vi });
        }
        setIsFilterModalVisible(false);
    };

    const ExerciseFilter = writingExercises.filter(exercise => {
        if (selectedTopic.id === exercise.topic_id) {
            return exercise;
        } else if (selectedTopic.slug === 'all') {
            return exercise;
        }
    });

    const renderExerciseItem = ({ item }: { item: WritingExercise }) => (
        <CardWritingExercise
            title={item.title}
            content_vi={item.content_vi}
            label={item.label}
            progress={70}
            handleStart={() => handleStartWritingExercise(item.id)}
        />
    );

    const renderEmptyList = () => (
        <View className="flex-1 items-center justify-center mt-20">
            <BookText size={64} color="#ccc" />
            <Text className="mt-4 text-gray-500 text-lg">Không tìm thấy bài tập nào</Text>
        </View>
    );


    return (
        <SafeAreaView className="flex-1 bg-[#f9fafb]">
            {/* Header Gradient (giữ nguyên) */}
            <LinearGradient
                colors={['#FF6B6B', '#FF8E8E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-5"
            >
                <View className="flex flex-row items-center justify-center relative">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="absolute left-0 w-10 h-10 rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center"
                        activeOpacity={0.8}
                    >
                        <ArrowLeft size={24} color="#fff" />
                    </TouchableOpacity>

                    <View className="flex items-center justify-center flex-1">
                        <Text className="text-white text-[20px] font-semibold">{levelExerciseName || "Danh sách bài tập"}</Text>
                        <Text className="text-white text-[14px]">{typeParagraphsName || "Tất cả chủ đề"}</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => setIsFilterModalVisible(true)}
                        className="absolute right-0 w-10 h-10 rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center"
                        activeOpacity={0.8}
                    >
                        <Filter size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* List (giữ nguyên) */}
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#FF6B6B" />
                    <Text className="mt-4 text-gray-500">Đang tải dữ liệu...</Text>
                </View>
            ) : (
                <>
                    <Text className='text-center mt-4 font-semibold text-2xl'>{selectedTopic.name_vi}</Text>
                    <FlatList
                        data={ExerciseFilter}
                        renderItem={renderExerciseItem}
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={renderEmptyList}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
                        showsVerticalScrollIndicator={false}
                    />
                </>

            )}

            {/* Modal lọc chủ đề */}
            <TopicFilterModal
                visible={isFilterModalVisible}
                onClose={() => setIsFilterModalVisible(false)}
                topics={topicFilters}
                onSelectTopic={handleSelectTopic}
            />
        </SafeAreaView>
    );
}