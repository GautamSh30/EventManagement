import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minLength: [6, 'Username must be at least 6 characters long'],
        maxLength: [50, 'Username must not be longer than 50 characters'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, 'Email must be at least 6 characters long'],
        maxLength: [50, 'Email must not be longer than 50 characters'],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        default: 'user',
    },
});

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { username: this.username, email: this.email, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const User = mongoose.model('user', userSchema);

export default User;
