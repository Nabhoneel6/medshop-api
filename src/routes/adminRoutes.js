import express from "express";
import {
  getAllUsers,
  toggleBlockUser,
  getStats,
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// All admin routes require login + admin role
router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.put("/users/:id/block", toggleBlockUser);
router.get("/stats", getStats);

export default router;
