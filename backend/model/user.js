import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["moderator", "college authority"],
        required: false
        // required: true
    },
    profile: {
        bio: {
            type: String,
            default: "" // Default empty bio to avoid undefined issues
        },
        socialLinks: [{
            type: String
        }],
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department' // Reference to the Company model
        },
        profilePhoto: {
            type: String,
            default: "" // Default empty string to avoid issues
        }
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt timestamps
});

// Export the User model
const User = mongoose.model("User", UserSchema);

export default User;
