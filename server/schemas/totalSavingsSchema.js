import { mongoose, Schema } from "mongoose";

const totalSavingsSchema = new Schema({
    totalSavings: { type: Number, default: 0, required: true },
});

export const totalSavingsModel = mongoose.model("totalSavings", totalSavingsSchema);