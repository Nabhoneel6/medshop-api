import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Recalculate totals
cartSchema.methods.recalculate = function () {
  this.totalItems = this.items.reduce((sum, i) => sum + i.quantity, 0);
  this.totalPrice = this.items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0,
  );
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
