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
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../utils/firebase");
exports.findRaces = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'races'));
        const raceQuery = yield (0, firestore_1.getDocs)(q);
        if (!raceQuery.empty) {
            const race = raceQuery.docs.map(race => (Object.assign({}, race.data())));
            return race;
        }
        return undefined;
    });
};
exports.createRace = function (userToken, race) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            userOwner: userToken,
            nombreCarrera: race.nombreCarrera,
            distanciaCarrera: race.distanciaCarrera,
            fechaCarrera: race.fechaCarrera,
            lugarCarrera: race.lugarCarrera
        };
        console.log(data);
        try {
            yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, 'races'), data);
            return data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
};
