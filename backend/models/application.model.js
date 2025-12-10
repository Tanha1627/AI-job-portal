import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['pending', 'accepted', 'rejected'],
        default:'pending'
    },
    // New fields for application form
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
       
    },
    phoneNumber:{
        type: Number,
        required:true
    },
    resumeFileUrl:{
        type:String,
        required:true
    },
    resumeOriginalName:{
        type:String,
        required:true
    },
    coverLetter:{
        type:String,
        required:true,
        maxlength:2000 // Limit cover letter to 2000 characters
    }
},{timestamps:true});

export const Application  = mongoose.model("Application", applicationSchema);