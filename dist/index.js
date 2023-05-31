"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const port = Number(process.env.PORT || 5000);
module.exports = (0, express_1.default)()
    .use((0, cors_1.default)())
    .use(express_1.default.json({ limit: '5mb' }))
    .use(express_1.default.urlencoded({ extended: false, limit: '5mb' }))
    .use('/', routes_1.default)
    .listen(port, () => console.log(`🚀 Server running on port: ${port}`));
