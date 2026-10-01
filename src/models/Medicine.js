import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    mrp: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
    composition: {
      type: String,
      default: "",
    },
    dosage: {
      type: String,
      default: "",
    },
    manufacturer: {
      type: String,
      default: "",
    },
    requiresPrescription: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      default: [],
    },
    expiryDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Text search index
medicineSchema.index({ name: "text", brand: "text", description: "text" });

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;
