import React, { RefObject } from "react";
import { StyleSheet, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Checkbox, IconButton, Text } from "react-native-paper";
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface TaskItemProps {
    index: number;
    task: { title: string; description: string; completed: boolean };
    swipeableRef: RefObject<SwipeableMethods | null>;
    toggleComplete: (index: number) => void;
    openEditTask: (index: number) => void;
    deleteTask: (index: number) => void;
}

export function TaskItem({ index, task, swipeableRef, toggleComplete, openEditTask, deleteTask }: TaskItemProps) {
    // Right swipe action for delete + cancel
    function renderRightActions(progress: SharedValue<number>) {
        const styleAnimation = useAnimatedStyle(() => {
            const scale = interpolate(progress.value, [0, 1], [0.5, 1], Extrapolation.CLAMP);
            const opacity = interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP);

            return {
                transform: [{ scale }],
                opacity,
            };
        });

        return (
            <Animated.View style={[{ flexDirection: "row", alignItems: "center" }, styleAnimation]}>
                <RectButton
                    style={styles.deleteButton}
                    rippleColor="transparent"
                    onPress={() => swipeableRef.current?.close()}
                >
                    <IconButton
                        icon="close"
                        iconColor="gray"
                        containerColor="transparent"
                        size={28}
                    />
                </RectButton>

                <RectButton
                    style={styles.deleteButton}
                    rippleColor="transparent"
                    onPress={() => deleteTask(index)}
                >
                    <IconButton
                        icon="delete"
                        iconColor="#d95f5fff"
                        containerColor="transparent"
                        size={28}
                    />
                </RectButton>
            </Animated.View>
        );
    };

    return (
        <Swipeable ref={swipeableRef} renderRightActions={renderRightActions}>
            <View style={styles.taskCard}>
                <Checkbox status={task.completed ? "checked" : "unchecked"} onPress={() => toggleComplete(index)} color="#333" />
                <RectButton onPress={() => openEditTask(index)} style={{ flex: 1, marginLeft: 12 }}>
                    <View>
                        <Text style={task.completed ? styles.completed : styles.title}>{task.title}</Text>
                        <Text style={styles.description}>{task.description}</Text>
                    </View>
                </RectButton>
            </View>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    taskCard: {
        backgroundColor: "#fff",
        borderRadius: 5,
        marginVertical: 6,
        marginHorizontal: 1,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: { fontSize: 16, fontWeight: "600", color: "#111" },
    description: { fontSize: 14, color: "#6B7280" },
    completed: { color: "#9CA3AF", textDecorationLine: "line-through" },
    deleteButton: { justifyContent: "center", alignItems: "center", marginVertical: 2, borderRadius: 8 },
});
