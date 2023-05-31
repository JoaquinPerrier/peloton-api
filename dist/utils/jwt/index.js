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
const jwt = require('jsonwebtoken');
require('dotenv').config();
exports.createToken = function (payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1000000s' });
        return token;
    });
};
exports.checkToken = function (req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if (token === null || token == undefined)
                throw new Error('JWT: Missing token');
            const user = jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                if (err)
                    throw new Error('JWT: Not Authorized (Expired token or signature is not verified)');
                return decodedToken;
            });
            return user;
        }
        catch (error) {
            return { error, message: error.message };
        }
    });
};
