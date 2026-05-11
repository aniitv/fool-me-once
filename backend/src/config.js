import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "../.env") });

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("MONGODB_URI is undefined");
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database cannot be connected", err));

const Loginschema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const collection = mongoose.model("accounts", Loginschema);
export default collection;
