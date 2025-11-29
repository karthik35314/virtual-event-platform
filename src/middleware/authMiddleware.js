const jwt = require('jsonwebtoken');
const SECRET = 'secretkey';

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
        return res.status(401).json({ message: 'Missing token' });
    }
    try {
        const payload = jwt.verify(token, SECRET);
        req.user = payload; // { sub, username }
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = { SECRET, authenticate };
