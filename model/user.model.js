import mongoose from "mongoose";
import { hash, genSalt } from "bcrypt";

const userSchema = mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

const user = mongoose.model("user", userSchema);
export default user;
