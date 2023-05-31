"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const playerModel = require('../models/playerModel');
exports.create_player = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { name, email, code } = req.body;
            code = Number(code);
            if (!name || !email || !code) {
                throw new Error('Missing params');
            }
            yield playerModel.createPlayer(name, email, code);
            res.status(200).send({ message: 'Status OK' });
        }
        catch (err) {
            res.status(401).send({ message: err.message });
        }
    });
};
exports.get_scores = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let triviaCode = Number(req.query.code);
            if (!triviaCode) {
                throw new Error('Missing params');
            }
            const scores = yield playerModel.getScores(triviaCode);
            scores.forEach((el) => {
                delete el.email;
                delete el.incorrectsAnswers;
                delete el.correctsAnswers;
                delete el.code;
            });
            scores.sort(function (a, b) {
                return b.score - a.score;
            });
            res.status(200).send({ message: 'Status OK', data: { scores } });
        }
        catch (err) {
            res.status(401).send({ message: err.message });
        }
    });
};
