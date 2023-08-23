"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const usersController = require('./controllers/usersController');
router.get('/', (_req, res) => {
    res.send({ message: 'Server successfully connected' });
});
// USERS ROUTES
router.post('/api/login', (_req, res) => {
    usersController.login(_req, res);
});
exports.default = router;
