import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import User from "./src/models/User.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = process.argv[2];
    if (!email) {
      console.error(
        "❌ Please provide an email: node makeAdmin.js your@email.com",
      );
      process.exit(1);
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`❌ No user found with email: ${email}`);
      process.exit(1);
    }

    user.role = "admin";
    await user.save();

    console.log(`✅ ${user.name} (${user.email}) is now an ADMIN`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

makeAdmin();
