import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
    value: {
        type:String,
        unique:true,
        default: "USER"
    }
}, {
    timestamps: true,
})

export default mongoose.model('Role', RoleSchema)