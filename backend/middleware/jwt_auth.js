const jwt = require('jsonwebtoken');
require("dotenv").config();

const deactivated_jwt = new Set();

const auth_middleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    if (deactivated_jwt.has(token)) {
        return res.status(400).json({ message: 'Deactivated token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user_id = decoded.user_id;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = {
    auth_middleware,
    deactivate_jwt: (jwt) => deactivated_jwt.add(jwt)
};