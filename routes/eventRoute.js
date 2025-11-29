const { Router } = require('express');
const { listEvents, createEvent, updateEvent, deleteEvent, registerForEvent } = require('../src/controllers/eventController.js');
const { authenticate } = require('../src/middleware/authMiddleware.js');

const router = Router();
router.get('/', listEvents);
router.post('/', authenticate, createEvent);
router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);
router.post('/:id/register', authenticate, registerForEvent);

module.exports = router;
