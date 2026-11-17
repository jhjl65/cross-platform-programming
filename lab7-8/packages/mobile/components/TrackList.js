import { FlatList, StyleSheet, Text, View } from "react-native";
import TrackItem from "./TrackItem";

export default function TrackList({ tracks, onToggle, onDelete }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Список треків</Text>

      {tracks.length === 0 ? (
        <Text style={styles.empty}>Треків поки немає. Додайте перший для релаксу чи сну!</Text>
      ) : (
        <>
          <Text style={styles.hint}>
            Торкніться треку, щоб позначити його завантаженим для офлайн-режиму.
          </Text>
          <FlatList
            data={tracks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TrackItem track={item} onToggle={onToggle} onDelete={onDelete} />
            )}
            keyboardShouldPersistTaps="handled"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
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
  hint: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 10,
  },
  empty: {
    textAlign: "center",
    color: "#64748b",
    paddingVertical: 20,
  },
});
