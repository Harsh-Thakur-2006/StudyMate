import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../contexts/ThemeContext";
import { useSafeArea } from "../hooks/useSafeArea";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";
import { GoalService, SubjectService } from "../services/StorageService";
import { LinearGradient } from "expo-linear-gradient";

export default function GoalSettingScreen({ navigation }) {
  const [goals, setGoals] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { colors, gradients } = useTheme();
  const { safeAreaStyle } = useSafeArea();

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    targetHours: "",
    subjectId: "",
    priority: 3,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [loadedGoals, loadedSubjects] = await Promise.all([
      GoalService.getGoals(),
      SubjectService.getSubjects(),
    ]);
    setGoals(loadedGoals);
    setSubjects(loadedSubjects);
  };

  const handleCreateGoal = async () => {
    if (!newGoal.title.trim()) {
      Alert.alert("Error", "Please enter a goal title");
      return;
    }

    if (
      !newGoal.targetHours ||
      isNaN(newGoal.targetHours) ||
      newGoal.targetHours <= 0
    ) {
      Alert.alert("Error", "Please enter a valid target hours");
      return;
    }

    try {
      await GoalService.saveGoal({
        ...newGoal,
        targetHours: parseFloat(newGoal.targetHours),
      });

      Alert.alert("Success", "Goal created successfully!");
      setNewGoal({
        title: "",
        description: "",
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        targetHours: "",
        subjectId: "",
        priority: 3,
      });
      setModalVisible(false);
      loadData();
    } catch (error) {
      Alert.alert("Error", "Failed to create goal");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewGoal((prev) => ({ ...prev, targetDate: selectedDate }));
    }
  };

  const getProgressPercentage = (goal) => {
    return goal.targetHours > 0
      ? (goal.completedHours / goal.targetHours) * 100
      : 0;
  };

  const getPriorityColor = (priority) => {
    const colorsMap = {
      1: colors.error, // High
      2: colors.warning, // Medium
      3: colors.success, // Low
    };
    return colorsMap[priority] || colors.text.tertiary;
  };

  const getPriorityText = (priority) => {
    const texts = { 1: "High", 2: "Medium", 3: "Low" };
    return texts[priority] || "Low";
  };

  const renderGoalItem = (goal) => {
    const progress = getProgressPercentage(goal);
    const subject = subjects.find((s) => s.id === goal.subjectId);
    const isCompleted = progress >= 100;

    return (
      <Card key={goal.id} style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={styles.goalTitleContainer}>
            <Text style={[styles.goalTitle, { color: colors.text.primary }]}>
              {goal.title}
            </Text>
            {isCompleted && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.success}
              />
            )}
          </View>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(goal.priority) + "20" },
            ]}
          >
            <Text
              style={[
                styles.priorityText,
                { color: getPriorityColor(goal.priority) },
              ]}
            >
              {getPriorityText(goal.priority)}
            </Text>
          </View>
        </View>

        {goal.description ? (
          <Text
            style={[styles.goalDescription, { color: colors.text.secondary }]}
          >
            {goal.description}
          </Text>
        ) : null}

        {subject && (
          <View style={styles.subjectInfo}>
            <View
              style={[styles.colorDot, { backgroundColor: subject.color }]}
            />
            <Text
              style={[styles.subjectName, { color: colors.text.secondary }]}
            >
              {subject.name}
            </Text>
          </View>
        )}

        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text
              style={[styles.progressText, { color: colors.text.secondary }]}
            >
              Progress: {goal.completedHours.toFixed(1)}h / {goal.targetHours}h
            </Text>
            <Text style={[styles.progressPercent, { color: colors.primary }]}>
              {progress.toFixed(0)}%
            </Text>
          </View>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: colors.glass.border },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: isCompleted
                    ? colors.success
                    : colors.primary,
                },
              ]}
            />
          </View>
        </View>

        <Text style={[styles.dueDate, { color: colors.text.tertiary }]}>
          Due: {new Date(goal.targetDate).toLocaleDateString()}
        </Text>
      </Card>
    );
  };

  return (
    <LinearGradient
      colors={gradients.background}
      style={[styles.container, safeAreaStyle]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Header
        title="Study Goals"
        subtitle="Set and track your study targets"
        showThemeToggle={true}
        showBackButton={true}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add Goal Button */}
        <View style={styles.addButtonContainer}>
          <Button
            title="Set New Goal"
            onPress={() => setModalVisible(true)}
            color="primary"
            style={styles.addButton}
          />
        </View>

        {/* Goals List */}
        {goals.length > 0 ? (
          goals.map(renderGoalItem)
        ) : (
          <Card style={styles.emptyState}>
            <Ionicons
              name="flag-outline"
              size={60}
              color={colors.text.tertiary}
            />
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
              No Goals Yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              Set your first study goal to stay motivated and track your
              progress
            </Text>
            <Button
              title="Create First Goal"
              onPress={() => setModalVisible(true)}
              color="primary"
              style={styles.emptyButton}
            />
          </Card>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Create Goal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContainer}>
            <Card style={styles.modalContent}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                Create New Goal
              </Text>

              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.glass.background,
                    borderColor: colors.glass.border,
                    color: colors.text.primary,
                  },
                ]}
                placeholder="Goal title"
                placeholderTextColor={colors.text.tertiary}
                value={newGoal.title}
                onChangeText={(text) =>
                  setNewGoal((prev) => ({ ...prev, title: text }))
                }
              />

              <TextInput
                style={[
                  styles.textInput,
                  styles.textArea,
                  {
                    backgroundColor: colors.glass.background,
                    borderColor: colors.glass.border,
                    color: colors.text.primary,
                  },
                ]}
                placeholder="Description (optional)"
                placeholderTextColor={colors.text.tertiary}
                value={newGoal.description}
                onChangeText={(text) =>
                  setNewGoal((prev) => ({ ...prev, description: text }))
                }
                multiline={true}
                numberOfLines={3}
              />

              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.glass.background,
                    borderColor: colors.glass.border,
                    color: colors.text.primary,
                  },
                ]}
                placeholder="Target hours"
                placeholderTextColor={colors.text.tertiary}
                value={newGoal.targetHours}
                onChangeText={(text) =>
                  setNewGoal((prev) => ({ ...prev, targetHours: text }))
                }
                keyboardType="numeric"
              />

              <TouchableOpacity
                style={[
                  styles.dateButton,
                  {
                    backgroundColor: colors.glass.background,
                    borderColor: colors.glass.border,
                  },
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={[
                    styles.dateButtonText,
                    { color: colors.text.primary },
                  ]}
                >
                  Target Date: {newGoal.targetDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={newGoal.targetDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}

              <Text style={[styles.label, { color: colors.text.secondary }]}>
                Subject (optional)
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.subjectsScroll}
              >
                <TouchableOpacity
                  style={[
                    styles.subjectOption,
                    {
                      backgroundColor: colors.glass.background,
                      borderColor: colors.glass.border,
                    },
                    !newGoal.subjectId && styles.subjectSelected,
                  ]}
                  onPress={() =>
                    setNewGoal((prev) => ({ ...prev, subjectId: "" }))
                  }
                >
                  <Text
                    style={[
                      styles.subjectOptionText,
                      { color: colors.text.primary },
                    ]}
                  >
                    General
                  </Text>
                </TouchableOpacity>
                {subjects.map((subject) => (
                  <TouchableOpacity
                    key={subject.id}
                    style={[
                      styles.subjectOption,
                      {
                        backgroundColor: colors.glass.background,
                        borderColor: colors.glass.border,
                      },
                      newGoal.subjectId === subject.id && [
                        styles.subjectSelected,
                        { borderColor: subject.color },
                      ],
                    ]}
                    onPress={() =>
                      setNewGoal((prev) => ({ ...prev, subjectId: subject.id }))
                    }
                  >
                    <View
                      style={[
                        styles.colorDot,
                        { backgroundColor: subject.color },
                      ]}
                    />
                    <Text
                      style={[
                        styles.subjectOptionText,
                        { color: colors.text.primary },
                      ]}
                    >
                      {subject.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[styles.label, { color: colors.text.secondary }]}>
                Priority
              </Text>
              <View style={styles.priorityContainer}>
                {[1, 2, 3].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      {
                        backgroundColor: colors.glass.background,
                        borderColor: colors.glass.border,
                      },
                      newGoal.priority === priority && [
                        styles.prioritySelected,
                        { borderColor: getPriorityColor(priority) },
                      ],
                    ]}
                    onPress={() =>
                      setNewGoal((prev) => ({ ...prev, priority }))
                    }
                  >
                    <Text
                      style={[
                        styles.priorityOptionText,
                        { color: colors.text.primary },
                      ]}
                    >
                      {getPriorityText(priority)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  color="error"
                  variant="outlined"
                  style={styles.modalButton}
                />
                <Button
                  title="Create Goal"
                  onPress={handleCreateGoal}
                  color="success"
                  style={styles.modalButton}
                />
              </View>
            </Card>
          </ScrollView>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  addButtonContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  addButton: {
    width: "100%",
  },
  goalCard: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  goalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
  },
  goalDescription: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  subjectInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  subjectName: {
    fontSize: 12,
    fontWeight: "500",
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "bold",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  dueDate: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    marginHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyButton: {
    width: "80%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
  },
  modalContainer: {
    maxHeight: "80%",
  },
  modalContent: {
    padding: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  textInput: {
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 15,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  dateButton: {
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    marginBottom: 15,
  },
  dateButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  subjectsScroll: {
    marginBottom: 15,
  },
  subjectOption: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
  },
  subjectSelected: {
    borderWidth: 2,
  },
  subjectOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  priorityOption: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    alignItems: "center",
  },
  prioritySelected: {
    borderWidth: 2,
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  bottomPadding: {
    height: 30,
  },
});
