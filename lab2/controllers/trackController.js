import mongoose from "mongoose";
import Track from "../models/Track.js";

const FIELDS = ["title", "artist", "category", "durationSec", "audioUrl", "isDownloaded"];

// Залишає в тілі запиту лише дозволені поля
function pickFields(body) {
  return Object.fromEntries(FIELDS.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]));
}

function invalidId(res) {
  return res.status(400).json({ message: "Некоректний формат id" });
}

// GET /api/tracks — усі треки (спочатку нові)
export async function getTracks(req, res) {
  try {
    const tracks = await Track.find().sort({ createdAt: -1 });
    res.status(200).json(tracks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// GET /api/tracks/:id — один трек
export async function getTrackById(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);
  try {
    const track = await Track.findById(req.params.id);
    if (!track) return res.status(404).json({ message: "Трек не знайдено" });
    res.status(200).json(track);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// POST /api/tracks — створити трек
export async function createTrack(req, res) {
  try {
    const track = await Track.create(pickFields(req.body));
    res.status(201).json(track);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// PUT /api/tracks/:id — оновити трек
export async function updateTrack(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);
  try {
    const track = await Track.findByIdAndUpdate(req.params.id, pickFields(req.body), {
      new: true,
      runValidators: true,
    });
    if (!track) return res.status(404).json({ message: "Трек не знайдено" });
    res.status(200).json(track);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// DELETE /api/tracks/:id — видалити трек
export async function deleteTrack(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);
  try {
    const track = await Track.findByIdAndDelete(req.params.id);
    if (!track) return res.status(404).json({ message: "Трек не знайдено" });
    res.status(200).json({ message: "Трек успішно видалено" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
