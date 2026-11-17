import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TrackItem({ track, onToggle, onDelete }) {
  return (
    <View style={[styles.item, track.isDownloaded && styles.itemDone]}>
      <TouchableOpacity style={styles.info} onPress={() => onToggle(track.id)}>
        <Text style={[styles.title, track.isDownloaded && styles.titleDone]}>
          {track.title}
        </Text>
        <Text style={styles.meta}>
          {track.artist} · {track.category.toUpperCase()}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(track.id)}>
        <Text style={styles.deleteText}>Видалити</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  itemDone: {
    backgroundColor: "#dcfce7",
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: "#64748b",
  },
  meta: {
    fontSize: 13,
    color: "#475569",
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  deleteText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
