import userModel from "../models/user.model.js";
import mongoose from "mongoose";

export const createUser = async ({ username, email, password }) => {
    if (!email || !password || !username) {
        throw new Error('Incomplete credentials');
    }
    const hashedPassword = await userModel.hashPassword(password);
    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
    });
    return user;
};

export const authenticateUser = async ({ email, password }) => {
    const user = await userModel.findOne({ email }).select('+password');
    if (!user || !(await user.isValidPassword(password))) {
        throw new Error('Invalid credentials');
    }
    return user;
};

export const logoutUser = async (token, redisClient) => {
    if (!token) {
        throw new Error('No token provided');
    }
    await redisClient.set(token, 'logout', 'EX', 60 * 60 * 24); // Blacklist token for 24 hours
};

export const findUserById = async ({userId}) => {
    if(!userId) throw new Error('User ID is required')
    if(!mongoose.Types.ObjectId.isValid(userId)) throw new Error('User ID is invalid')

    const user = await userModel.findOne({_id: userId});
    if (!user) throw new Error('User not found');
    return user;
};

export const updateUserById = async (id, updateData) => {
    const user = await userModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    }).select('-password');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
