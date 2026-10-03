import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import Doctor from "./src/models/Doctor.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const doctors = [
  {
    name: "Dr. Saurabh Kumar",
    specialty: "General Physician",
    experience: "3+ years",
    qualification: "MBBS",
    rating: 4.8,
    fee: 249,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200",
    about: "General physician with expertise in common ailments.",
  },
  {
    name: "Dr. Anjali Sharma",
    specialty: "Pediatrician",
    experience: "8+ years",
    qualification: "MBBS, MD",
    rating: 4.9,
    fee: 349,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200",
    about: "Specialist in child healthcare and vaccination.",
  },
  {
    name: "Dr. Rajesh Mehta",
    specialty: "Dermatologist",
    experience: "12+ years",
    qualification: "MBBS, MD (Skin)",
    rating: 4.7,
    fee: 499,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200",
    about: "Skin and hair specialist.",
  },
  {
    name: "Dr. Priya Nair",
    specialty: "Gynecologist",
    experience: "10+ years",
    qualification: "MBBS, MS",
    rating: 4.9,
    fee: 449,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200",
    about: "Women's health specialist.",
  },
  {
    name: "Dr. Vikram Singh",
    specialty: "Cardiologist",
    experience: "15+ years",
    qualification: "MBBS, MD, DM",
    rating: 4.8,
    fee: 599,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200",
    about: "Heart specialist with 15+ years experience.",
  },
  {
    name: "Dr. Meera Iyer",
    specialty: "General Physician",
    experience: "5+ years",
    qualification: "MBBS, DNB",
    rating: 4.6,
    fee: 299,
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200",
    about: "Family physician and wellness consultant.",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected");
    await Doctor.deleteMany({});
    console.log("🗑️  Cleared doctors");
    const created = await Doctor.insertMany(doctors);
    console.log(`👨‍⚕️ Added ${created.length} doctors`);
    process.exit(0);
  } catch (err) {
    console.error("❌", err.message);
    process.exit(1);
  }
};

seed();
