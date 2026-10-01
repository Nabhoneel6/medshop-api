import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import Category from "./src/models/Category.js";
import Medicine from "./src/models/Medicine.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const categories = [
  { name: "Tablets", description: "Oral tablets for common ailments" },
  { name: "Capsules", description: "Gelatin capsules for various treatments" },
  { name: "Syrups", description: "Liquid medicines for cough, cold, etc." },
  { name: "Vitamins", description: "Daily supplements and vitamins" },
  { name: "Powders", description: "Powdered formulations (ORS, etc.)" },
  { name: "Ointments", description: "Topical creams and ointments" },
];

const medicines = [
  {
    name: "Paracetamol 500mg",
    brand: "Cipla",
    categoryName: "Tablets",
    price: 45,
    mrp: 60,
    stock: 120,
    description: "Relieves fever and mild pain.",
    composition: "Paracetamol 500mg",
    dosage: "1 tablet twice a day",
    manufacturer: "Cipla Ltd.",
    requiresPrescription: false,
    images: ["https://via.placeholder.com/300x300?text=Paracetamol"],
  },
  {
    name: "Amoxicillin 250mg",
    brand: "Sun Pharma",
    categoryName: "Capsules",
    price: 120,
    mrp: 150,
    stock: 60,
    description: "Antibiotic for bacterial infections.",
    composition: "Amoxicillin 250mg",
    dosage: "As prescribed",
    manufacturer: "Sun Pharma",
    requiresPrescription: true,
    images: ["https://via.placeholder.com/300x300?text=Amoxicillin"],
  },
  {
    name: "Cough Syrup",
    brand: "Dabur",
    categoryName: "Syrups",
    price: 85,
    mrp: 99,
    stock: 200,
    description: "Relieves cough and cold.",
    composition: "Honey, Tulsi",
    dosage: "2 tsp thrice a day",
    manufacturer: "Dabur India",
    requiresPrescription: false,
    images: ["https://via.placeholder.com/300x300?text=Cough+Syrup"],
  },
  {
    name: "Vitamin D3",
    brand: "HealthKart",
    categoryName: "Vitamins",
    price: 299,
    mrp: 399,
    stock: 90,
    description: "Bone health supplement.",
    composition: "Cholecalciferol",
    dosage: "1 tablet daily",
    manufacturer: "HealthKart",
    requiresPrescription: false,
    images: ["https://via.placeholder.com/300x300?text=Vitamin+D3"],
  },
  {
    name: "Ibuprofen 400mg",
    brand: "Abbott",
    categoryName: "Tablets",
    price: 60,
    mrp: 75,
    stock: 110,
    description: "Pain and inflammation relief.",
    composition: "Ibuprofen 400mg",
    dosage: "1 tablet after meals",
    manufacturer: "Abbott",
    requiresPrescription: false,
    images: ["https://via.placeholder.com/300x300?text=Ibuprofen"],
  },
  {
    name: "ORS Powder",
    brand: "Electral",
    categoryName: "Powders",
    price: 25,
    mrp: 30,
    stock: 300,
    description: "Rehydration solution.",
    composition: "Glucose, Sodium",
    dosage: "Mix in 1L water",
    manufacturer: "FDC Ltd.",
    requiresPrescription: false,
    images: ["https://via.placeholder.com/300x300?text=ORS"],
  },
  {
    name: "Antiseptic Cream",
    brand: "Betadine",
    categoryName: "Ointments",
    price: 75,
    mrp: 90,
    stock: 150,
    description: "For cuts and wounds.",
    composition: "Povidone Iodine",
    dosage: "Apply externally",
    manufacturer: "Win-Medicare",
    requiresPrescription: false,
    images: ["https://via.placeholder.com/300x300?text=Antiseptic"],
  },
  {
    name: "Cetirizine 10mg",
    brand: "Dr. Reddy's",
    categoryName: "Tablets",
    price: 35,
    mrp: 45,
    stock: 180,
    description: "Anti-allergic tablet.",
    composition: "Cetirizine 10mg",
    dosage: "1 tablet at night",
    manufacturer: "Dr. Reddy's",
    requiresPrescription: false,
    images: ["https://via.placeholder.com/300x300?text=Cetirizine"],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing
    await Category.deleteMany({});
    await Medicine.deleteMany({});
    console.log("🗑️  Cleared existing categories & medicines");

    // Insert categories
    const categoriesWithSlug = categories.map((c) => ({
      ...c,
      slug: c.name.toLowerCase().replace(/\s+/g, "-"),
    }));
    const createdCategories = await Category.insertMany(categoriesWithSlug);
    console.log(`📁 Added ${createdCategories.length} categories`);

    // Map category names → ObjectId
    const categoryMap = {};
    createdCategories.forEach((c) => {
      categoryMap[c.name] = c._id;
    });

    // Insert medicines with category refs
    const medsToInsert = medicines.map((m) => {
      const { categoryName, ...rest } = m;
      return { ...rest, category: categoryMap[categoryName] };
    });

    const createdMedicines = await Medicine.insertMany(medsToInsert);
    console.log(`💊 Added ${createdMedicines.length} medicines`);

    console.log("🎉 Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seed();
