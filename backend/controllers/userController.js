import User from '../model/user.js';  

// Register User
export const registerUser = async (req, res) => {
    try {
        // console.log("register endpoint hit")
        const { fullname, email, phoneNumber, password } = req.body;
        // console.log(fullname)

        // Check for missing fields
        if (!fullname || !email || !phoneNumber || !password) {
            return res.status(400).json({ 
                message: "All fields are required.", 
                success: false 
            });
        }

        // console.log("checkpoint1");
        
        // Check if the user already exists
        const existingUser = await User.findOne({email});
        // console.log(existingUser)
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Email already registered', 
                success: false 
            });
        }
        // console.log("checkpoint2");
        
        // Create a new user
        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: password
        });
        // console.log("checkpoint3");
        
        return res.status(201).json({ 
            message: "Account created successfully", 
            success: true,
            user: newUser 
        });
    } catch (error) {
        // console.log("checkpoint4");
        console.error("Error in registerUser:", error.message); // Log the error
        return res.status(500).json({ 
            message: "Server error. Please try again later.", 
            success: false, 
            error: error.message 
        });
    }
};

// Login User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required.", success: false });
        }

        // Make email case-insensitive
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        if (user.password != password) {
            return res.status(400).json({ message: 'Incorrect email or password', success: false });
        }

        res.status(200).json({ message: `Welcome back ${user.fullname}`, user, success: true });

    } catch (error) {
        console.error("Login error:", error); // Log the error for debugging
        return res.status(500).json({ message: "Server error. Please try again later.", success: false, error: error.message });
    }
};

// Logout User
export const logoutUser = async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(200).json({ message: 'Logout successful', success: true });
    } catch (error) {
        return res.status(500).json({ message: 'Server error. Please try again later.', success: false, error: error.message });
    }
};

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, socialLinks, department, profilePhoto } = req.body;
        const userId = req.body.userId;

        // Ensure the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Update user fields if provided
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        // Initialize profile if it doesn't exist
        if (!user.profile) {
            user.profile = {};
        }

        // Update profile fields if provided
        if (bio) user.profile.bio = bio;
        if (socialLinks) {
            if (Array.isArray(socialLinks)) {
                user.profile.socialLinks = socialLinks; // Update directly if an array
            } else if (typeof socialLinks === "string") {
                user.profile.socialLinks = socialLinks.split(','); // Convert a comma-separated string to an array
            }
        }
        if (department) user.profile.department = department; // Reference to the `Department` model
         if (profilePhoto) user.profile.profilePhoto = profilePhoto; // Update profile photo URL

        // Save changes to the user document
        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error. Please try again later.",
            success: false,
            error: error.message
        });
    }
};

// View Profile
export const viewProfile = async (req, res) => {
    try {
        const userId = req.body.userId;

        // Ensure the user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        return res.status(200).json({
            message: "Profile view",
            user,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error. Please try again later.",
            success: false,
            error: error.message
        });
    }
};