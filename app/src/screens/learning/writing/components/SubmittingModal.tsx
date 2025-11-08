import React from "react";
import { Modal, View, Text, ActivityIndicator, StyleSheet } from "react-native";

type Props = {
    visible: boolean;
    message?: string;
};

const SubmittingModal: React.FC<Props> = ({ visible, message = "Đang nộp bài..." }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Đổi màu loading */}
                    <ActivityIndicator size="large" color="#8A2BE2" />
                    <Text style={styles.message}>
                        {message}
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

export default SubmittingModal;

// Sử dụng StyleSheet thay vì inline styles
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        backgroundColor: "#fff",
        width: "70%",
        borderRadius: 16,
        paddingVertical: 32,
        paddingHorizontal: 20,
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    message: {
        marginTop: 16,
        fontSize: 16,
        color: "#374151",
    }
});