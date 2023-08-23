"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const usersController = require('./controllers/usersController');
const racesController = require('./controllers/racesController');
router.get('/', (_req, res) => {
    res.send({ message: 'Server successfully connected' });
});
// USERS ROUTES
router.post('/api/login', (_req, res) => {
    usersController.login(_req, res);
});
// RACES ROUTES
router.get('/api/races', (_req, res) => {
    racesController.find_races(_req, res);
});
exports.default = router;
