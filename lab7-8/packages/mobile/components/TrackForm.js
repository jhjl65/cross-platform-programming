import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const CATEGORIES = [
  { key: "ambient", label: "Ambient" },
  { key: "lofi", label: "Lo-Fi" },
  { key: "rain", label: "Rain & Nature" },
  { key: "whitenoise", label: "White Noise" },
];

export default function TrackForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [category, setCategory] = useState("ambient");

  const handleAdd = async () => {
    const added = await onAdd({ title, artist, category });
    if (added) {
      setTitle("");
      setArtist("");
      setCategory("ambient");
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Додати трек</Text>

      <TextInput
        style={styles.input}
        placeholder="Назва треку"
        value={title}
        onChangeText={setTitle}
        returnKeyType="next"
      />
      <TextInput
        style={styles.input}
        placeholder="Виконавець"
        value={artist}
        onChangeText={setArtist}
        returnKeyType="done"
        onSubmitEditing={handleAdd}
      />

      <Text style={styles.label}>Категорія</Text>
      <View style={styles.categories}>
        {CATEGORIES.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.chip, category === item.key && styles.chipActive]}
            onPress={() => setCategory(item.key)}
          >
            <Text style={[styles.chipText, category === item.key && styles.chipTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Додати трек</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 8,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#93c5fd",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  chipText: {
    color: "#1d4ed8",
    fontSize: 14,
  },
  chipTextActive: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
