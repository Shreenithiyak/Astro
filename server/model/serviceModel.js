import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "building" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
