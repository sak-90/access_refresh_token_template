import mongoose from "mongoose";
import { hash, genSalt } from "bcrypt";

const userSchema = mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

userSchema.pre("save", async (next) => {
  try {
    const salt = await genSalt(90);
    const hashedPassword = await hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

const user = mongoose.model("user", userSchema);
export default user;
