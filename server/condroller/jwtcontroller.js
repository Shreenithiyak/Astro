import authModle from "../model/jwtmodel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const handel = async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ msg: "All fields are required" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
    }
    try {
        const existing = await authModle.findOne({ email });
        if (existing) {
            return res.status(409).json({ msg: "Email already registered" });
        }
        const hashed = await bcrypt.hash(password, 10);
        const added = await authModle.create({ fullName, email, password: hashed });
        res.status(201).json({ msg: "Registration successful", user: { id: added._id, fullName: added.fullName, email: added.email } });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ msg: "Registration failed", error: error.message });
    }
}

export const handeller = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: "Email and password are required" });
    }
    try {
        const user = await authModle.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }
        const checkpass = await bcrypt.compare(password, user.password);
        if (!checkpass) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }
        const JWT_SECRET = process.env.JWT_SECURE || 'mysecretkey';
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "12h" });
        res.status(200).json({
            msg: "success",
            token,
            user: { id: user._id, fullName: user.fullName, email: user.email }
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ msg: "Login failed", error: error.message });
    }
}


export const getCurrentUser = async (req, res) => {
    try {
        const user = await authModle.findById(req.users.id).select('-password');
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.status(200).json({ user });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

export const DashBoardInfo =async (req,res)=>{
    try {
        res.status(200).json({msg:req.users})
    } catch (error) {
        console.log('error',error);
        res.status(500).json({msg: "Server error", error: error.message});
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await authModle.find().select('-password');
        res.status(200).json({ users });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ msg: "Error fetching users", error });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await authModle.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.status(200).json({ user });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ msg: "Error fetching user", error });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        let updateData = { fullName, email };
        
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        
        const updatedUser = await authModle.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        if (!updatedUser) return res.status(404).json({ msg: "User not found" });
        
        res.status(200).json({ msg: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ msg: "Error updating user", error });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await authModle.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ msg: "User not found" });
        
        res.status(200).json({ msg: "User deleted successfully" });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ msg: "Error deleting user", error });
    }
};