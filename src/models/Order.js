import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true,
  },
  name: String,
  brand: String,
  image: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      pincode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "CARD", "WALLET"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    itemsPrice: { type: Number, required: true },
    deliveryFee: { type: Number, default: 40 },
    totalPrice: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      default: null,
    },
    deliveredAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
