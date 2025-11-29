const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { users } = require('../models/dataStore.js');
const { SECRET } = require('../middleware/authMiddleware.js');

function register(req, res) {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
    }
    const exists = users.find(u => u.username === username);
    if (exists) {
        return res.status(409).json({ message: 'User already exists' });
    }
    const hashed = bcrypt.hashSync(password, 10);
    const user = { id: users.length + 1, username, password: hashed };
    users.push(user);
    return res.status(201).json({ id: user.id, username: user.username });
}

function login(req, res) {
    const { username, password } = req.body || {};
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ sub: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
    return res.json({ token });
}

module.exports = { register, login };
