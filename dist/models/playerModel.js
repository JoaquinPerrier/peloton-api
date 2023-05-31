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
exports.createPlayer = function (name, email, code) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            name,
            email,
            code,
            score: 0,
            correctsAnswers: 0,
            incorrectsAnswers: 0
        };
        try {
            const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'players'), (0, firestore_1.where)('email', '==', email), (0, firestore_1.where)('code', '==', code));
            const playerQuery = yield (0, firestore_1.getDocs)(q);
            if (playerQuery.empty) {
                const player = yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, 'players'), data);
                return player.id;
            }
            else {
                throw new Error('You already played this trivia!');
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
};
exports.addScore = function (code, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let trivia_uid = '';
            const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'players'), (0, firestore_1.where)('email', '==', email), (0, firestore_1.where)('code', '==', code));
            let playerQuery = yield (0, firestore_1.getDocs)(q);
            if (playerQuery.empty) {
                throw new Error('Error in player params');
            }
            trivia_uid = playerQuery.docs[0].id;
            const triviaRef = (0, firestore_1.doc)(firebase_1.db, 'players', trivia_uid);
            yield (0, firestore_1.updateDoc)(triviaRef, {
                score: (0, firestore_1.increment)(5),
                correctsAnswers: (0, firestore_1.increment)(1)
            });
            playerQuery = yield (0, firestore_1.getDocs)(q);
            const playerInfo = playerQuery.docs.map(player => (Object.assign({}, player.data())));
            return playerInfo;
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
};
exports.addIncorrectAnswer = function (code, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let trivia_uid = '';
            const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'players'), (0, firestore_1.where)('email', '==', email), (0, firestore_1.where)('code', '==', code));
            let playerQuery = yield (0, firestore_1.getDocs)(q);
            if (playerQuery.empty) {
                throw new Error('Error in player params');
            }
            trivia_uid = playerQuery.docs[0].id;
            const triviaRef = (0, firestore_1.doc)(firebase_1.db, 'players', trivia_uid);
            yield (0, firestore_1.updateDoc)(triviaRef, {
                incorrectsAnswers: (0, firestore_1.increment)(1)
            });
            playerQuery = yield (0, firestore_1.getDocs)(q);
            const playerInfo = playerQuery.docs.map(player => (Object.assign({}, player.data())));
            return playerInfo;
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
};
exports.getScores = function (code) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'players'), (0, firestore_1.where)('code', '==', code));
            const scoreQuery = yield (0, firestore_1.getDocs)(q);
            if (scoreQuery.empty) {
                throw new Error('No one has played this trivia');
            }
            const playerInfo = scoreQuery.docs.map(score => (Object.assign({}, score.data())));
            return playerInfo;
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
};
