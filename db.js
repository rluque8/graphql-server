import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

try {
  await mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to mongoDB");
} catch (error) {
  console.log(`Error connecting to mongoDB url: ${error}`);
}
