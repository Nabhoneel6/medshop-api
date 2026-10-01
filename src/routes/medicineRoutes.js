import express from "express";
import {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicineController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Public
router.get("/", getMedicines);
router.get("/:id", getMedicineById);

// Admin only
router.post("/", protect, adminOnly, createMedicine);
router.put("/:id", protect, adminOnly, updateMedicine);
router.delete("/:id", protect, adminOnly, deleteMedicine);

export default router;
