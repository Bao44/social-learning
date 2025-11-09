import React, { useRef, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Animated, Easing } from "react-native";
// Đổi icon để khớp với chức năng: Gợi ý (Sparkles), Từ điển (BookOpen), Nộp bài (Send)
import { BookOpen, Send, SquarePlus, Bot } from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";

type FloatingMenuProps = {
    onCheck: () => void; // Sẽ kích hoạt handleFeedback (Gợi ý AI)
    onHint: () => void;  // Sẽ kích hoạt handleDictionary (Từ điển)
    onSubmit: () => void; // Sẽ kích hoạt handleSubmit (Nộp bài)
};

export default function FloatingMenu({ onCheck, onHint, onSubmit }: FloatingMenuProps) {
    const [open, setOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        setOpen(!open);
        Animated.timing(animation, {
            toValue: open ? 0 : 1,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    };

    // Cập nhật icon và màu
    const buttons = [
        // Nút Gợi ý AI (onCheck)
        { icon: <Bot size={22} color="#fff" />, color: "#f59e0b", action: onCheck },
        // Nút Từ điển (onHint)
        { icon: <BookOpen size={22} color="#fff" />, color: "#10b981", action: onHint },
        // Nút Nộp bài (onSubmit)
        { icon: <Send size={22} color="#fff" />, color: "#3b82f6", action: onSubmit },
    ];

    return (
        <View style={styles.container}>
            {buttons.map((btn, index) => {
                // Logic xoay (giữ nguyên)
                const startAngle = 90;
                const endAngle = 180;
                const angle = startAngle + (index * (endAngle - startAngle)) / (buttons.length - 1);

                const x = animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 90 * Math.cos((angle * Math.PI) / 180)],
                });

                const y = animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -90 * Math.sin((angle * Math.PI) / 180)],
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.option,
                            { transform: [{ translateX: x }, { translateY: y }, { scale: animation }] },
                        ]}
                    >
                        <TouchableOpacity
                            style={[styles.optionButton, { backgroundColor: btn.color }]}
                            onPress={() => {
                                toggleMenu(); // Tự động đóng menu khi bấm
                                btn.action();
                            }}
                            activeOpacity={0.8}
                        >
                            {btn.icon}
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}

            {/* Nút trung tâm (giữ nguyên) */}
            <LinearGradient
                colors={['#8A2BE2', '#4B0082']} // Đổi màu tím
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 50, elevation: 5 }} // Thêm elevation
            >
                <TouchableOpacity style={styles.mainButton} onPress={toggleMenu} activeOpacity={0.9}>
                    <Animated.View style={{
                        transform: [{
                            rotate: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '45deg']
                            })
                        }]
                    }}>
                        <SquarePlus size={28} color="#fff" />
                    </Animated.View>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}

// StyleSheet (giữ nguyên, chỉ thêm zIndex)
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 60,
        right: 25,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 998, // Đảm bảo nổi trên content
    },
    mainButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    option: {
        position: "absolute",
        bottom: 0,
        right: 0,
    },
    optionButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
    },
});