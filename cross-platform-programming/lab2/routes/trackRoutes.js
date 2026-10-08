import express from "express";
import {
  getTracks,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
} from "../controllers/trackController.js";
import { validateTrack } from "../middleware/validateTrack.js";

const router = express.Router();

router.get("/", getTracks);
router.get("/:id", getTrackById);
router.post("/", validateTrack, createTrack);
router.put("/:id", validateTrack, updateTrack);
router.delete("/:id", deleteTrack);

export default router;
