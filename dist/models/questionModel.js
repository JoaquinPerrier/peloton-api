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
exports.createQuestions = function (questions, code) {
    return __awaiter(this, void 0, void 0, function* () {
        const idsQuestions = [];
        try {
            for (let i = 0; i < questions.length; i++) {
                questions[i]['code'] = code;
                const questionID = yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, 'questions'), questions[i]);
                idsQuestions.push(questionID.id);
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            return idsQuestions;
        }
    });
};
exports.getQuestions = function (code) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'questions'), (0, firestore_1.where)('code', '==', code));
        const questionsQuery = yield (0, firestore_1.getDocs)(q);
        if (!questionsQuery.empty) {
            const questions = questionsQuery.docs.map(question => (Object.assign({}, question.data())));
            return questions;
        }
        return undefined;
    });
};
exports.getCorrectQuestion = function (code, questionName) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'questions'), (0, firestore_1.where)('code', '==', code), (0, firestore_1.where)('text', '==', questionName));
        const questionsQuery = yield (0, firestore_1.getDocs)(q);
        if (!questionsQuery.empty) {
            const question = questionsQuery.docs.map(question => (Object.assign({}, question.data())));
            return question;
        }
        return undefined;
    });
};
exports.deleteQuestion = function (code) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const questionID = yield (0, firestore_1.deleteDoc)((0, firestore_1.doc)(firebase_1.db, 'questions', code));
            return questionID;
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
};
