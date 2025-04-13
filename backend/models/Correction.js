import mongoose from "mongoose";

const correctionSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Correction = mongoose.model("Correction", correctionSchema);

export default Correction;