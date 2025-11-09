import { CircleEqual, Snowflake } from "lucide-react-native";
import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

type SubmitModalProps = {
    visible: boolean;
    onClose: () => void;
    practice_score: number;
    snowflake: number;
};

const WritingSubmitModal: React.FC<SubmitModalProps> = ({
    visible,
    onClose,
    practice_score,
    snowflake
}) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-[rgba(0,0,0,0.5)] items-center justify-center">
                <View className="bg-white p-6 rounded-2xl w-[80%] items-center">
                    <Text className="text-xl font-bold text-gray-800 mb-5">
                        Hoàn thành! 🎉
                    </Text>

                    {/* Chỉ hiển thị điểm và snowflake */}
                    <View className="flex flex-row items-center justify-evenly w-full pb-6">
                        <View className="flex flex-col items-center justify-center gap-2">
                            <Text className="text-3xl text-[#EEB422] font-bold">+ {practice_score}</Text>
                            <CircleEqual size={40} color={"#EEB422"} />
                        </View>
                        <View className="flex flex-col items-center justify-center gap-2">
                            <Text className="text-3xl text-[#0000FF] font-bold">+ {snowflake}</Text>
                            <Snowflake size={40} color={"#0000FF"} />
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-[#8A2BE2] px-6 py-3 rounded-lg"
                        onPress={onClose}
                    >
                        <Text className="text-white font-semibold">Tiếp tục</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default WritingSubmitModal;