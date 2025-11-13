import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number, // ✅ better than Number
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['jobseeker', 'recruiter'], // ✅ clearer naming
        required: true
    },
    profile: {
        bio: { type: String },
        skills: [String],
        resumeFileUrl: { type: String },   // ✅ file link
        resumeOriginalName: { type: String },
        resumeText: { type: String },      // ✅ parsed text for AI
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: ""
        }
    },
}, { timestamps: true });

userSchema.index({ "profile.skills": 1 }); // ✅ helps with matching later

export const User = mongoose.model('User', userSchema);
