import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database cannot be Connected", err);
  });

const Loginschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const collection = new mongoose.model("accounts", Loginschema);

export default collection;
