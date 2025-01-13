import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.service.js';

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Please authenticate' });
        }

        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

export const ensureSameUser = async (req, res, next) => {
    try {
        if (req.user.email !== req.body.email) {
            return res.status(403).json({ error: 'Forbidden: Cannot update another user\'s data' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const allowSelfOrAdmin = (req, res, next) => {
    try {
        const { id } = req.params;

        if (req.user.role !== 'admin' && req.user._id !== id) {
            return res.status(403).json({ error: 'Forbidden: Access denied' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
