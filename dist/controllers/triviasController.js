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
const triviaModel = require('../models/triviaModel');
const questionModel = require('../models/questionModel');
const playerModel = require('../models/playerModel');
const jwtUtil = require('../utils/jwt/index');
exports.find_by_code = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let triviaCode = Number(req.query.code);
    let trivia = [];
    trivia = yield triviaModel.findByCode(triviaCode);
    if (trivia) {
        delete trivia[0].firebase_uid;
        trivia[0].questions = yield questionModel.getQuestions(triviaCode);
        if (trivia[0].questions) {
            trivia[0].questions.forEach((element) => {
                delete element.code;
                element.answers.forEach((answer) => {
                    delete answer.isCorrect;
                });
            });
        }
        res.status(200).send({ message: 'Status OK', data: { trivia: [trivia[0]] } });
    }
    else {
        res.status(404).send({ message: 'Invalid code' });
    }
});
exports.find_by_code_entire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToken = yield jwtUtil.checkToken(req);
        if (userToken.message) {
            throw Error(userToken.message);
        }
        let triviaCode = Number(req.query.code);
        let trivia = [];
        trivia = yield triviaModel.findByCode(triviaCode);
        if (trivia[0].firebase_uid != userToken.firebase_uid) {
            throw new Error('This trivia doesn´t belong to this user');
        }
        if (trivia) {
            trivia[0].questions = yield questionModel.getQuestions(triviaCode);
            res.status(200).send({ message: 'Status OK', data: { trivia: [trivia[0]] } });
        }
        else {
            res.status(404).send({ message: 'Invalid code' });
        }
    }
    catch (err) {
        res.status(401).send({ message: err.message });
    }
});
exports.find_trivias_from_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToken = yield jwtUtil.checkToken(req);
        if (userToken.message) {
            throw Error(userToken.message);
        }
        let trivia = yield triviaModel.findByToken(userToken.firebase_uid);
        if (trivia) {
            trivia.forEach((el) => {
                delete el.firebase_uid;
                delete el.questions;
            });
            res.status(200).send({ message: 'Status OK', trivias: trivia });
        }
        else {
            res.status(401).send({ message: 'User doesn´t have any trivias' });
        }
    }
    catch (err) {
        res.status(401).send({ Error: err.name });
    }
});
exports.create_trivia = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userToken = yield jwtUtil.checkToken(req);
            if (userToken.message) {
                throw Error(userToken.message);
            }
            let triviaCompleta = req.body;
            let date = String(Date.now());
            let code = Number(date.substring(date.length - 8));
            if (!triviaCompleta.name || !triviaCompleta.questions) {
                throw Error('Error: missing params ');
            }
            const idsQuestions = yield questionModel.createQuestions(triviaCompleta.questions, code);
            let trivia = yield triviaModel.createTrivia(userToken.firebase_uid, idsQuestions, triviaCompleta, code);
            delete trivia.firebase_uid;
            delete trivia.questions;
            res.status(200).send({ message: 'Status OK', trivia });
        }
        catch (err) {
            res.status(501).send({ message: err.message });
        }
    });
};
exports.verify_answer = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { codeTrivia, questionName, answerChoosen, email } = req.body;
        try {
            if (!codeTrivia || !questionName || answerChoosen == undefined || !email) {
                throw Error('Error: missing params ');
            }
            codeTrivia = Number(codeTrivia);
            const answerInfo = yield questionModel.getCorrectQuestion(codeTrivia, questionName);
            if (!answerInfo) {
                throw Error('Error: question doens´t exist');
            }
            if (answerInfo[0].answers[answerChoosen].isCorrect) {
                const playerInfo = yield playerModel.addScore(codeTrivia, email);
                let { score, correctsAnswers, incorrectsAnswers } = playerInfo[0];
                res.status(200).send({
                    message: 'Status OK',
                    data: { player: [{ isCorrect: true, correctAnswer: answerChoosen, score, correctsAnswers, incorrectsAnswers }] }
                });
            }
            else {
                const correctAnswer = answerInfo[0].answers.findIndex((el) => el.isCorrect == true);
                const playerInfo = yield playerModel.addIncorrectAnswer(codeTrivia, email);
                let { score, correctsAnswers, incorrectsAnswers } = playerInfo[0];
                res.status(200).send({
                    message: 'Status OK',
                    data: { player: [{ isCorrect: false, correctAnswer: correctAnswer, score, correctsAnswers, incorrectsAnswers }] }
                });
            }
        }
        catch (err) {
            res.status(401).send({ message: err.message });
        }
    });
};
exports.delete_trivia = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userToken = yield jwtUtil.checkToken(req);
            if (userToken.message) {
                throw Error(userToken.message);
            }
            let triviaCode = Number(req.query.code);
            let triviaData = yield triviaModel.findByCode(triviaCode);
            if (!triviaData) {
                throw Error('Trivia doesn´t exist!');
            }
            if (triviaData[0].firebase_uid == userToken.firebase_uid) {
                triviaData[0].questions.forEach((questionID) => __awaiter(this, void 0, void 0, function* () {
                    yield questionModel.deleteQuestion(questionID);
                }));
                yield triviaModel.deleteTrivia(triviaCode);
                res.status(200).send({ message: 'Status OK' });
            }
            else {
                res.status(401).send({ message: 'This trivia doesn´t belong to this user' });
            }
        }
        catch (err) {
            res.status(401).send({ message: err.message });
        }
    });
};
