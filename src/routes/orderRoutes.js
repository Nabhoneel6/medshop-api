import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// All order routes require login
router.use(protect);

// Customer routes
router.post("/", placeOrder);
router.get("/my", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);

// Admin routes
router.get("/", adminOnly, getAllOrders);
router.put("/:id/status", adminOnly, updateOrderStatus);

export default router;
