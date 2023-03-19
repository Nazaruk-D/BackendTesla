"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const app = (0, express_1.default)();
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const authRouter = require('./authRouter');
const profileRouter = require('./profileRouter');
const PORT = process.env.PORT || 7542;
exports.connection = mysql.createConnection({
    host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '479ukXTghZsCFgw.root',
    password: '2kcSGnAulyiZ0Jj2',
    database: 'carshop',
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
});
exports.connection.connect((err) => {
    if (err) {
        return console.log(JSON.stringify(err));
    }
    else {
        return console.log('Подключение успешно');
    }
});
const corsOptions = {
    origin: (origin, callback) => {
        console.log("origin: ", origin);
        callback(null, true);
    },
    credentials: true,
    optionSuccessStatus: 200
};
const jsonBodyMiddleWare = express_1.default.json();
app.use(jsonBodyMiddleWare);
app.use(cors(corsOptions));
app.use(cookieParser('secret key'));
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/demo', profileRouter);
app.get("/", (req, res) => {
    res.json({ message: "hi from Express App" });
    return console.log('Соединение закрыто');
});
app.listen(PORT, () => {
    console.log(`I started listening port: ${PORT}`);
});
