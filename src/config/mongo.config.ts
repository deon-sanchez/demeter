import mongoose from "mongoose";
import { MONGO_URI } from "../config/env";

const connectDB = async () =>
  await mongoose.connect(MONGO_URI).then(() => {
    console.log(`Connected to database ${MONGO_URI}`);
  });

export default connectDB;
