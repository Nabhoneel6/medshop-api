import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import User from "./src/models/User.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const [email, newPassword] = process.argv.slice(2);

const run = async () => {
  if (!email || !newPassword) {
    console.log("Usage: node resetAdminPassword.js user@email.com newpassword");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected");

  const user = await User.findOne({ email });
  if (!user) {
    console.error(`❌ No user with email: ${email}`);
    process.exit(1);
  }

  user.password = newPassword; // hashed by pre-save hook
  await user.save();

  console.log(`\n✅ Password reset for ${user.name} (${user.email})`);
  console.log(`   New password: ${newPassword}`);
  console.log(`   Role: ${user.role}`);
  process.exit(0);
};

run().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
