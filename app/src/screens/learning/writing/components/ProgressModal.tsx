import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal } // THÊM: Import Modal
    from "react-native"

type ProgressModalProps = {
    visible: boolean;
    onClose: () => void;
    progress?: any | null;
};

const WritingProgressModal: React.FC<ProgressModalProps> = ({ visible, onClose, progress }) => {

    // Bỏ "if (!visible) return null"

    return (
        // THÊM: Bọc trong <Modal>
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>

                {/* Nội dung modal (giữ nguyên code của bạn) */}
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>📈 Tiến độ học</Text>
                    {progress ? (
                        <View style={styles.progressBox}>
                            <Text style={styles.progressText}>🔰 Trạng thái: {progress?.isCorrect === true ? "Đã hoàn thành" : "Chưa hoàn thành"}</Text>
                            <Text style={styles.progressText}>
                                📅 Số lần nộp: {progress?.submit_times || 0}
                            </Text>
                            <Text style={styles.progressText}>🔥 Điểm cao nhất: {progress?.score}</Text>
                        </View>
                    ) : (
                        <Text style={styles.emptyText}>Chưa có dữ liệu tiến độ</Text>
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
                {/* Hết nội dung modal */}

            </View>
        </Modal>
    )
}
export default WritingProgressModal

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1, // SỬA: Đổi thành flex: 1
        backgroundColor: "rgba(0,0,0,0.3)",
        alignItems: "center",
        justifyContent: "center",
        // SỬA: Bỏ "position", "zIndex", "top", "left"...
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 16,
        width: "85%",
        padding: 20,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 16,
        textAlign: "center",
    },
    progressBox: {
        backgroundColor: "#f3e8ff",
        borderWidth: 1,
        borderColor: "#d8b4fe",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    progressText: {
        fontSize: 15,
        color: "#374151",
        marginBottom: 6,
    },
    emptyText: {
        textAlign: "center",
        color: "#6b7280",
        marginVertical: 8,
    },
    closeButton: {
        backgroundColor: "#8A2BE2",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 16,
    },
    closeText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
})