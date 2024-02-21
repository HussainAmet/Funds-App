import { mongoose, Schema } from "mongoose";

const totalSavingsSchema = new Schema({
    totalSavings: Number,
});

export const totalSavingsModel = mongoose.model("totalSavings", totalSavingsSchema);