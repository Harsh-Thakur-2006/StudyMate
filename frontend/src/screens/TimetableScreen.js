import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useSafeArea } from "../hooks/useSafeArea";
import { LinearGradient } from "expo-linear-gradient";

export default function TimetableScreen() {
  const { colors, gradients } = useTheme();
  const { safeAreaStyle } = useSafeArea();

  return (
    <LinearGradient
      colors={gradients.background}
      style={[styles.container, safeAreaStyle]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.glassCard}>
        <Text style={styles.emptyText}>No timetable entries yet</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#888888",
    marginBottom: 30,
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  emptyText: {
    fontSize: 16,
    color: "#888888",
    fontStyle: "italic",
  },
});
