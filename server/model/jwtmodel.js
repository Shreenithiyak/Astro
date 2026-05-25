import mongoose from "mongoose";

const jSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String
}, { timestamps: true })


const authModle = mongoose.model("populates",jSchema)

export default authModle