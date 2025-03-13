import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Student schema
const studentSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Student"],
      default: "Student",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare passwords
studentSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

export const Student = mongoose.model("Student", studentSchema);