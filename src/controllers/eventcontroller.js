const { events, users } = require('../models/dataStore.js');

function listEvents(req, res) {
    return res.json(events);
}

function createEvent(req, res) {
    const { title, date, capacity } = req.body || {};
    if (!title || !date) {
        return res.status(400).json({ message: 'Title and date are required' });
    }
    const cap = Number.isFinite(Number(capacity)) ? Number(capacity) : 100;
    const event = {
        id: events.length + 1,
        title,
        date,
        capacity: cap,
        attendees: [],
    };
    events.push(event);
    return res.status(201).json(event);
}

function updateEvent(req, res) {
    const id = Number(req.params.id);
    const event = events.find(e => e.id === id);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }
    const { title, date, capacity } = req.body || {};
    if (title !== undefined) event.title = title;
    if (date !== undefined) event.date = date;
    if (capacity !== undefined) event.capacity = Number(capacity);
    return res.json(event);
}

function deleteEvent(req, res) {
    const id = Number(req.params.id);
    const idx = events.findIndex(e => e.id === id);
    if (idx === -1) {
        return res.status(404).json({ message: 'Event not found' });
    }
    events.splice(idx, 1);
    return res.status(204).send();
}

function registerForEvent(req, res) {
    const id = Number(req.params.id);
    const event = events.find(e => e.id === id);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }
    const userId = req.user && req.user.sub;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (event.attendees.includes(userId)) {
        return res.status(409).json({ message: 'Already registered' });
    }
    if (event.attendees.length >= event.capacity) {
        return res.status(400).json({ message: 'Event capacity reached' });
    }
    event.attendees.push(userId);
    return res.json({ message: 'Registered', attendeesCount: event.attendees.length });
}

module.exports = {
    listEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
};
