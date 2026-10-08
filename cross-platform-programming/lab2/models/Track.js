import mongoose from "mongoose";

const trackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true }, // напр. rain, lofi, ambient, white-noise
    durationSec: { type: Number, min: 1 },                   // тривалість треку, секунди
    audioUrl: { type: String, trim: true },                  // посилання на аудіофайл
    isDownloaded: { type: Boolean, default: false },         // чи збережено для офлайн-режиму
  },
  { timestamps: true }
);

const Track = mongoose.model("Track", trackSchema);

export default Track;
