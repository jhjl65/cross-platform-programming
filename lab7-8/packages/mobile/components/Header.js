import { StyleSheet, Text, View } from "react-native";

export default function Header({ total, downloaded }) {
  return (
    <View>
      <Text style={styles.title}>🌙 Wavely Mobile</Text>
      <Text style={styles.stats}>
        Усього треків: {total} · Завантажено офлайн: {downloaded}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1d4ed8",
    textAlign: "center",
    marginBottom: 8,
  },
  stats: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    marginBottom: 20,
  },
});
