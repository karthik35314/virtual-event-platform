const { register, login } = require('../../src/controllers/authController.js');
const { users } = require('../../src/models/dataStore.js');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../../src/middleware/authMiddleware.js');
const bcrypt = require('bcrypt');

const mockRes = () => {
    const res = {};
    res.statusCode = 200;
    res.body = undefined;
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (payload) => { res.body = payload; return res; };
    res.send = () => { return res; };
    return res;
};

describe('authController', () => {
    beforeEach(() => { users.length = 0; });

    test('register: creates user', () => {
        const req = { body: { username: 'alice', password: 'password123' } };
        const res = mockRes();
        register(req, res);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ id: 1, username: 'alice' });
        expect(users).toHaveLength(1);
    });

    test('register: conflict on duplicate username', () => {
        users.push({ id: 1, username: 'alice', password: bcrypt.hashSync('password123', 10) });
        const req = { body: { username: 'alice', password: 'newpass' } };
        const res = mockRes();
        register(req, res);
        expect(res.statusCode).toBe(409);
    });

    test('login: success returns token', () => {
        const hashed = bcrypt.hashSync('password123', 10);
        users.push({ id: 1, username: 'alice', password: hashed });
        const req = { body: { username: 'alice', password: 'password123' } };
        const res = mockRes();
        login(req, res);
        expect(res.statusCode).toBe(200);
        expect(typeof res.body.token).toBe('string');
        const payload = jwt.verify(res.body.token, SECRET);
        expect(payload.username).toBe('alice');
    });

    test('login: invalid credentials', () => {
        const req = { body: { username: 'bob', password: 'x' } };
        const res = mockRes();
        login(req, res);
        expect(res.statusCode).toBe(401);
    });
});
