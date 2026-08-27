import dotenv from "dotenv";
dotenv.config({});
import mongoose from 'mongoose';

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

export default main;
