import { useCallback, useEffect, useState } from "react";
import { Alert, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TrackService } from "@wavely/core";
import { AsyncStorageAdapter } from "./asyncStorageAdapter.js";
import Header from "./components/Header";
import TrackForm from "./components/TrackForm";
import TrackList from "./components/TrackList";

// Уся логіка перевірки і зберігання — в ядрі та адаптері; тут лише показ результатів.
const service = new TrackService(new AsyncStorageAdapter(AsyncStorage));

export default function App() {
  const [tracks, setTracks] = useState([]);

  const refresh = useCallback(async () => {
    setTracks(await service.list());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTrack = async (input) => {
    const result = await service.add(input);
    if (!result.ok) {
      Alert.alert("Помилка", result.error);
      return false;
    }
    await refresh();
    Alert.alert("Успіх", "Трек успішно додано до медіатеки.");
    return true;
  };

  const toggleTrack = async (id) => {
    await service.toggle(id);
    await refresh();
  };

  const deleteTrack = async (id) => {
    await service.remove(id);
    await refresh();
    Alert.alert("Видалення", "Трек видалено з бібліотеки.");
  };

  const downloadedCount = tracks.filter((t) => t.isDownloaded).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Header total={tracks.length} downloaded={downloadedCount} />
        <TrackForm onAdd={addTrack} />
        <TrackList tracks={tracks} onToggle={toggleTrack} onDelete={deleteTrack} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#eff6ff" },
  container: { flex: 1, padding: 20 },
});
