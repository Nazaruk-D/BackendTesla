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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 7542;
const endPoints = {
    startPage: '/',
    me: '/auth/me',
    registration: '/auth/register',
    login: '/auth/login',
    logout: '/auth/me'
};
const connection = mysql.createConnection({
    host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '479ukXTghZsCFgw.root',
    password: '2kcSGnAulyiZ0Jj2',
    database: 'test',
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
});
const users = [];
connection.connect((err) => {
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
app.use(cors(corsOptions));
const jsonBodyMiddleWare = express_1.default.json();
app.use(jsonBodyMiddleWare);
app.get(endPoints.startPage, (req, res) => {
    res.json({ message: "hi from Express App" });
    return console.log('Соединение закрыто');
});
app.get(endPoints.me, (req, res) => {
    res.status(200).json({ message: "response me request" });
    return console.log('Соединение закрыто');
});
app.post(endPoints.registration, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, } = req.body;
    // Check if user already exists
    const userExists = users.find((user) => user.email === email);
    if (userExists) {
        return res.status(409).json({ message: 'User already exists' });
    }
    // Hash the password
    const salt = yield bcrypt.genSalt(10);
    const hashedPassword = yield bcrypt.hash(password, salt);
    const userId = (0, uuid_1.v1)();
    // Save the user to the database
    const user = { userId, firstName, lastName, email, password: hashedPassword };
    users.push(user);
    res.status(201).json({ message: 'User registered successfully' });
    return console.log('Соединение закрыто');
}));
app.post(endPoints.login, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Check if user exists
    const user = users.find((user) => user.email === email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Check if password is correct
    const passwordMatch = yield bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ email }, 'secret');
    res.status(200).json({ message: 'Logged in successfully', token });
    return console.log('Соединение закрыто');
}));
app.listen(PORT, () => {
    console.log(`I started listening port: ${PORT}`);
});
