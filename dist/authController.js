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
const uuid_1 = require("uuid");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const users = [];
class authController {
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Ошибка при регистрации", errors });
                }
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
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Registration error' });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = users.find((user) => user.email === email);
                if (!user) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
                const passwordMatch = yield bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
                const token = jwt.sign({ email }, 'secret');
                res.cookie('token', token);
                res.status(200).json({ message: 'Logged in successfully', token });
                return console.log('Соединение закрыто');
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Login error' });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.json("server work");
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Logout error' });
            }
        });
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.token;
                if (!token) {
                    return res.status(401).json({ message: 'Unauthorized in token', token });
                }
                const decodedToken = jwt.verify(token, 'secret');
                const email = decodedToken.email;
                const user = users.find((user) => user.email === email);
                if (!user) {
                    return res.status(401).json({ message: 'Unauthorized in user' });
                }
                res.status(200).json({ email });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Me error' });
            }
        });
    }
}
module.exports = new authController();
