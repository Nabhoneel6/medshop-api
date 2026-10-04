import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import Medicine from "./src/models/Medicine.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const imageMap = {
  "Paracetamol 500mg":
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
  "Amoxicillin 250mg":
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400",
  "Cough Syrup":
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
  "Vitamin D3":
    "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400",
  "Ibuprofen 400mg":
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
  "ORS Powder":
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
  "Antiseptic Cream":
    "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400",
  "Cetirizine 10mg":
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
  "Aspirin 75mg":
    "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400",
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const medicines = await Medicine.find({});
  console.log(`Found ${medicines.length} medicines\n`);

  let updated = 0;
  for (const med of medicines) {
    const newImage = imageMap[med.name];
    if (newImage) {
      med.images = [newImage];
      await med.save();
      console.log(`✅ ${med.name}`);
      updated++;
    } else {
      console.log(`⏭️  ${med.name} (no mapping, skipped)`);
    }
  }

  console.log(`\n🎉 Updated ${updated} of ${medicines.length} medicines`);
  process.exit(0);
};

run().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
