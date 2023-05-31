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
exports.findByCode = function (trivia_code) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'trivias'), (0, firestore_1.where)('code', '==', trivia_code));
        const triviaQuery = yield (0, firestore_1.getDocs)(q);
        if (!triviaQuery.empty) {
            const trivia = triviaQuery.docs.map(trivia => (Object.assign({}, trivia.data())));
            return trivia;
        }
        return undefined;
    });
};
exports.findByToken = function (userToken) {
    return __awaiter(this, void 0, void 0, function* () {
        //.collection("trivias").where("user_uid", "==", "userToken")
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'trivias'), (0, firestore_1.where)('firebase_uid', '==', userToken));
        const triviaQuery = yield (0, firestore_1.getDocs)(q);
        if (!triviaQuery.empty) {
            const trivia = triviaQuery.docs.map(trivia => (Object.assign({}, trivia.data())));
            return trivia;
        }
        return undefined;
    });
};
exports.createTrivia = function (userToken, idsQuestions, triviaCompleta, code) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            code,
            name: triviaCompleta.name,
            firebase_uid: userToken,
            questions: idsQuestions
        };
        try {
            const questionID = yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, 'trivias'), data);
            return data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
};
exports.deleteTrivia = function (code) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let trivia_uid = '';
            const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'trivias'), (0, firestore_1.where)('code', '==', code));
            const triviaQuery = yield (0, firestore_1.getDocs)(q);
            yield triviaQuery.forEach(doc => {
                trivia_uid = doc.id;
            });
            const triviaUID = yield (0, firestore_1.deleteDoc)((0, firestore_1.doc)(firebase_1.db, 'trivias', trivia_uid));
            return triviaUID;
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
};
