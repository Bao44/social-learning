import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    SafeAreaView,
} from 'react-native';
import { X } from 'lucide-react-native';

// Định nghĩa kiểu Topic (lấy từ ListExerciseWriting)
type Topic = {
    id: number;
    name_vi: string;
    slug: string;
};

// Định nghĩa Props cho Modal
type TopicFilterModalProps = {
    visible: boolean;
    onClose: () => void;
    topics: Topic[];
    onSelectTopic: (arg: { id: number; slug: string; name_vi: string } | 'all') => void;
};

export default function TopicFilterModal({
    visible,
    onClose,
    topics,
    onSelectTopic
}: TopicFilterModalProps) {

    // Hàm render item (chuyển từ ListExerciseWriting sang)
    const renderFilterItem = ({ item }: { item: Topic }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => onSelectTopic({ id: item.id, slug: item.slug, name_vi: item.name_vi })}
        >
            <Text style={styles.modalItemText}>{item.name_vi}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Lọc theo chủ đề</Text>
                            <TouchableOpacity onPress={onClose}>
                                <X size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={topics}
                            renderItem={renderFilterItem}
                            keyExtractor={(item) => item.id.toString()}
                            ListHeaderComponent={
                                // Nút "Tất cả"
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => onSelectTopic("all")}
                                >
                                    <Text style={styles.modalItemText}>Tất cả chủ đề</Text>
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
}

// Styles (chuyển từ ListExerciseWriting sang)
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeArea: {
        width: '90%',
        maxHeight: '70%',
    },
    modalContainer: {
        width: '100%',
        maxHeight: '100%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 12,
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    modalItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalItemText: {
        fontSize: 16,
        color: '#555',
    },
});