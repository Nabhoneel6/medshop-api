import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import User from "./src/models/User.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const list = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({}, "name email role phone isBlocked");
  console.log("\n📋 All Users:\n");
  users.forEach((u) => {
    console.log(
      `${u.role.padEnd(10)} | ${u.email.padEnd(30)} | ${u.name}${
        u.isBlocked ? " [BLOCKED]" : ""
      }`,
    );
  });
  process.exit(0);
};

list();
