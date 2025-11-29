const { events, users } = require('../../src/models/dataStore.js');
const {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
} = require('../../src/controllers/eventController.js');

const jwt = require('jsonwebtoken');
const { SECRET } = require('../../src/middleware/authMiddleware.js');

const mockRes = () => {
    const res = {};
    res.statusCode = 200;
    res.body = undefined;
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (payload) => { res.body = payload; return res; };
    res.send = () => { return res; };
    return res;
};

describe('eventController', () => {
    beforeEach(() => { events.length = 0; users.length = 0; });

    test('createEvent then listEvents', () => {
        const reqCreate = { body: { title: 'Conf', date: '2025-12-01', capacity: 2 } };
        const resCreate = mockRes();
        createEvent(reqCreate, resCreate);
        expect(resCreate.statusCode).toBe(201);

        const resList = mockRes();
        listEvents({}, resList);
        expect(resList.body).toHaveLength(1);
        expect(resList.body[0].title).toBe('Conf');
    });

    test('updateEvent modifies fields', () => {
        events.push({ id: 1, title: 'Old', date: '2025-11-30', capacity: 10, attendees: [] });
        const reqUpd = { params: { id: '1' }, body: { title: 'New', capacity: 5 } };
        const resUpd = mockRes();
        updateEvent(reqUpd, resUpd);
        expect(resUpd.body.title).toBe('New');
        expect(resUpd.body.capacity).toBe(5);
    });

    test('deleteEvent removes an event', () => {
        events.push({ id: 1, title: 'A', date: '2025-11-30', capacity: 10, attendees: [] });
        const resDel = mockRes();
        deleteEvent({ params: { id: '1' } }, resDel);
        expect(resDel.statusCode).toBe(204);
        expect(events).toHaveLength(0);
    });

    test('registerForEvent requires auth and respects capacity', () => {
        events.push({ id: 1, title: 'Cap', date: '2025-11-30', capacity: 1, attendees: [] });
        users.push({ id: 1, username: 'alice', password: 'x' });
        const token = jwt.sign({ sub: 1, username: 'alice' }, SECRET);
        const resReg = mockRes();
        const reqReg = { params: { id: '1' }, headers: { authorization: `Bearer ${token}` }, user: { sub: 1, username: 'alice' } };
        registerForEvent(reqReg, resReg);
        expect(resReg.statusCode).toBe(200);

        const resReg2 = mockRes();
        const reqReg2 = { params: { id: '1' }, user: { sub: 2, username: 'bob' } };
        registerForEvent(reqReg2, resReg2);
        expect(resReg2.statusCode).toBe(400); // capacity reached
    });
});
