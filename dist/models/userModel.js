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
const auth_1 = require("firebase/auth");
exports.findOne = function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'admin'), (0, firestore_1.where)('user', '==', user));
        const userQuery = yield (0, firestore_1.getDocs)(q);
        if (!userQuery.empty) {
            const user = userQuery.docs.map(usuario => (Object.assign({}, usuario.data())));
            return user;
        }
        return undefined;
    });
};
exports.login = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let user;
        try {
            yield (0, auth_1.signInWithEmailAndPassword)(firebase_1.auth, email, password)
                .then(userCredential => {
                user = userCredential.user.uid;
            })
                .catch(error => {
                throw new Error(error.message);
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            return user;
        }
    });
};
exports.createNewUser = function (name, surname, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userCredential = yield (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, email, password);
            let uid = userCredential.user.uid;
            const newUserReference = yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, 'users'), {
                name: name,
                surname: surname,
                email: email,
                firebase_uid: uid
            });
            const newUser = yield (0, firestore_1.getDoc)(newUserReference);
            return newUser.data();
        }
        catch (error) {
            throw new Error(error);
        }
    });
};
exports.recoverPassword = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, auth_1.sendPasswordResetEmail)(firebase_1.auth, email)
            .then(() => {
            return true;
        })
            .catch(error => {
            throw new Error(error.message);
        });
    });
};
