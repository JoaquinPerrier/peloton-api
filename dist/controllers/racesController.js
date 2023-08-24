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
const racesModel = require('../models/racesModel');
const jwtUtil = require('../utils/jwt/index');
exports.find_races = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToken = yield jwtUtil.checkToken(req);
        if (userToken.message) {
            throw Error(userToken.message);
        }
        let races = yield racesModel.findRaces();
        if (races) {
            res.status(200).send({ message: 'Status OK', data: { races: races } });
        }
        else {
            res.status(200).send({ message: 'No races created' });
        }
    }
    catch (err) {
        res.status(401).send({ message: err.message });
    }
});
exports.create_races = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userToken = yield jwtUtil.checkToken(req);
            console.log(userToken);
            if (userToken.message) {
                throw Error(userToken.message);
            }
            let race = req.body;
            if (!race.nombreCarrera || !race.distanciaCarrera || !race.fechaCarrera || !race.lugarCarrera) {
                throw Error('Error: missing params ');
            }
            race = yield racesModel.createRace(userToken.user, race);
            res.status(200).send({ message: 'Status OK', race });
        }
        catch (err) {
            res.status(501).send({ message: err.message });
        }
    });
};
