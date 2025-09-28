import { Calendar } from "@/components/ui/calendar";
import { TaskItem } from "@/components/ui/task-item";
import { TaskModal } from "@/components/ui/task-modal";
import React, { RefObject, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { FAB, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Index() {


  // Dummy tasks mapped by day
  const [tasksByDate, setTasksByDate] = useState<Record<number, { title: string; description: string, completed: boolean }[]>>(
    {
      10: [
        { title: "Mobile App Design", description: "Create wireframes for login screen", completed: false },
        { title: "Team Meeting", description: "Discuss sprint backlog", completed: false },
        { title: "Write Documentation", description: "Update API reference", completed: false },
      ],
      11: [
        { title: "UI Review", description: "Check new button styles", completed: false },
        { title: "Fix Bug", description: "Resolve crash on profile page", completed: false },
      ],
      12: [
        { title: "Code Review", description: "Review PR #45", completed: false },
        { title: "Backend Sync", description: "Align on API contract changes", completed: false },
        { title: "Write Unit Tests", description: "Cover new user module", completed: false },
        { title: "Brainstorm Session", description: "Ideas for Q4 roadmap", completed: false },
      ],
      13: [{ title: "Weekend Planning", description: "Set up personal schedule", completed: false }],
    });

  const [selectedDate, setSelectedDate] = useState<{ day: number; weekday: string }>({
    day: 10,
    weekday: "Wed",
  });
  const tasks = tasksByDate[selectedDate.day] ?? [];
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitleDescription, setNewTitleDescription] = useState<{ title: string, description: string }>({
    title: '',
    description: '',
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const swipeableRefs = useRef<RefObject<SwipeableMethods | null>[]>([]);

  // Open modal for new task
  function openAddTask() {
    setNewTitleDescription({ title: '', description: '' });
    setEditingIndex(null);
    setModalVisible(true);
  }

  // Open modal for editing an existing task
  function openEditTask(index: number) {
    const task = tasks[index];
    setNewTitleDescription({ title: task.title, description: task.description })
    setEditingIndex(index);
    setModalVisible(true);
  }

  // Add new task
  function addTask() {
    if (!newTitleDescription.title.trim()) return;

    setTasksByDate((prev) => {
      const existingTasks = prev[selectedDate.day] ?? [];
      if (editingIndex !== null) {
        // Editing existing task
        const updated = [...existingTasks];
        updated[editingIndex] = {
          ...updated[editingIndex],
          title: newTitleDescription.title,
          description: newTitleDescription.description,
        };
        return { ...prev, [selectedDate.day]: updated };
      } else {
        // Adding new task
        return {
          ...prev,
          [selectedDate.day]: [
            ...existingTasks,
            { ...newTitleDescription, completed: false },
          ],
        };
      }
    });
    setModalVisible(false);
  }

  // Toggle completion
  function toggleComplete(index: number) {
    setTasksByDate((prev) => {
      const existing = prev[selectedDate.day] ?? [];
      const updated = [...existing];
      updated[index] = { ...updated[index], completed: !updated[index].completed };
      return { ...prev, [selectedDate.day]: updated };
    });
  }

  // Delete a task
  function deleteTask(index: number) {
    swipeableRefs.current[index]?.current?.close();
    setTasksByDate((prev) => {
      const existing = prev[selectedDate.day] ?? [];
      const updated = existing.filter((_, i) => i !== index);
      return { ...prev, [selectedDate.day]: updated };
    });

    // Also remove the ref to keep indexes aligned
    swipeableRefs.current.splice(index, 1);
  }

  const incompleteCount = tasks.filter((t) => !t.completed).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Calendar
        onSelectedDate={(date) => {
          setSelectedDate(date)
          swipeableRefs.current.forEach((ref) => {
            ref?.current?.close();
          });
        }}
      />

      <View style={{ flex: 1, padding: 16 }}>
        <View style={{ marginBottom: 16, gap: 2 }}>
          <Text variant="titleLarge" style={{ fontWeight: 'semibold' }}>
            Tasks for {selectedDate.weekday}, {selectedDate.day}
          </Text>
          <Text variant="bodyLarge">
            {tasks.length === 0
              ? "No tasks for today"
              : incompleteCount === 0
                ? "All tasks completed"
                : `You have ${incompleteCount} incomplete task${incompleteCount !== 1 ? "s" : ""} today`}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
          {tasks.length > 0 ? (
            tasks.map((task, i) => {
              if (!swipeableRefs.current[i]) {
                swipeableRefs.current[i] = React.createRef<SwipeableMethods>();
              }
              return (
                <TaskItem
                  key={i}
                  index={i}
                  task={task}
                  swipeableRef={swipeableRefs.current[i]}
                  toggleComplete={toggleComplete}
                  openEditTask={openEditTask}
                  deleteTask={deleteTask}
                />
              );
            })
          ) : (
            <Text style={{ color: "gray", textAlign: "center", marginTop: 20 }}>
              No tasks for this date
            </Text>
          )}
        </ScrollView>
      </View>

      <FAB
        icon="plus"
        color="white"
        style={styles.fab}
        onPress={openAddTask}
      />

      {/* Add/Edit Task Modal */}
      <TaskModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        titleDescription={newTitleDescription}
        setTitleDescription={setNewTitleDescription}
        onSave={addTask}
        isEditing={editingIndex !== null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    backgroundColor: "#333333ff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  }
});