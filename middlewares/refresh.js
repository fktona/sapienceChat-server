import jwt from 'jsonwebtoken';
import config from '../config/authConfig.js';
import db from '../models/index.js';
const User = db.user;


export const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];


    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded.id;
        next();
    });
};

export const protectedRoute = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('protected route' , user);

        const {_doc} = user;

        res.status(200).json({ ..._doc, message: 'user authenticated'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};