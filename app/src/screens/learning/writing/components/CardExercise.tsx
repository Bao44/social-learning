import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type CardProps = {
    title: string;
    content_vi: string;
    label: string;
    progress: number;
    handleStart: () => void;
};

// ProgressBar (giữ nguyên)
const ProgressBar = ({ progress }: { progress: number }) => (
    <View style={styles.progressBg}>
        <View style={[styles.progressFg, { width: `${progress}%` }]} />
    </View>
);

export default function CardWritingExercise({ title, content_vi, label, progress, handleStart }: CardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={handleStart}>
            <View>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                <Text style={styles.content} numberOfLines={3}>{content_vi}</Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>{'Tiến độ'}</Text>
                    <ProgressBar progress={progress} />
                </View>
            </View>
        </TouchableOpacity>
    );
}

// (StylesSheet giữ nguyên)
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        justifyContent: 'space-between',
        minHeight: 180,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#3B82F6',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    content: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 12,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
        marginTop: 'auto',
    },
    progressContainer: {
        flex: 1,
        marginRight: 12,
    },
    progressText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    progressBg: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
    },
    progressFg: {
        height: 6,
        backgroundColor: '#3B82F6',
        borderRadius: 3,
    },
    startButton: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3B82F6',
    },
});