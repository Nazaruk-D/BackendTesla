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
const index_1 = require("./index");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
class authController {
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Ошибка при регистрации", errors });
                }
                const { firstName, lastName, email, password } = req.body;
                const isAdmin = email === 'nikita.znak@mail.ru' || email === 'nazaruk-dima@mail.ru' ? 'admin' : 'user';
                const salt = yield bcrypt.genSalt(10);
                const hashedPassword = yield bcrypt.hash(password, salt);
                const userExistsQuery = `SELECT * FROM Users WHERE email = '${email}'`;
                const userRegisterQuery = `INSERT INTO Users (email, first_name, last_name, role, password_hash) VALUES ('${email}', '${firstName}', '${lastName}', '${isAdmin}', '${hashedPassword}')`;
                index_1.connection.query(userExistsQuery, (error, results) => {
                    if (error)
                        throw error;
                    if (results.length === 1) {
                        return res.status(409).json({ message: 'User already exists' });
                    }
                    else
                        (index_1.connection.query(userRegisterQuery, (error, results) => {
                            if (error)
                                throw error;
                            res.status(201).json({ message: 'User registered successfully' });
                        }));
                });
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
                const token = jwt.sign({ email }, 'secret');
                const query = `SELECT * FROM Users WHERE email = '${email}'`;
                index_1.connection.query(query, (error, results) => {
                    if (error)
                        throw error;
                    if (results.length === 1) {
                        const user = results[0];
                        const userData = {
                            id: user.id,
                            email: user.email,
                            firstName: user.first_name,
                            lastName: user.last_name,
                            avatar: user.avatar_url,
                            role: user.role,
                            createdAt: user.created_at,
                            updatedAt: user.updated_at
                        };
                        bcrypt.compare(password, user.password_hash, (error, match) => {
                            if (error)
                                throw error;
                            if (match) {
                                res.cookie('token', token, {
                                    expires: new Date(Date.now() + (3600 * 1000 * 24 * 180 * 1)),
                                    sameSite: 'none',
                                    secure: "true",
                                    httpOnly: true,
                                });
                                res.status(200).json({ message: 'Login successful', user: userData, statusCode: 200 });
                            }
                            else {
                                return res.status(401).json({ message: 'Incorrect email or password' });
                            }
                        });
                    }
                    else {
                        return res.status(401).json({ message: 'Incorrect email or password' });
                    }
                });
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
                res.cookie('token', "", {
                    expires: new Date(0),
                    sameSite: 'none',
                    secure: "true",
                    httpOnly: true,
                });
                res.status(200).json({ message: 'Logout successful', statusCode: 200 });
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
                // Find user
                const userExistsQuery = `SELECT u.*, r.region FROM Users u INNER JOIN Regions r ON u.region_id = r.id WHERE email = '${email}'`;
                index_1.connection.query(userExistsQuery, (error, results) => {
                    if (error)
                        throw error;
                    if (results.length === 1) {
                        const user = results[0];
                        const userData = {
                            id: user.id,
                            email: user.email,
                            firstName: user.first_name,
                            lastName: user.last_name,
                            region: user.region,
                            phoneNumber: user.phone_number,
                            avatar: user.avatar_url,
                            role: user.role,
                            createdAt: user.created_at,
                            updatedAt: user.updated_at
                        };
                        return res.status(200).json({ email: email, user: userData });
                    }
                    else {
                        return res.status(401).json({ message: 'Unauthorized in user' });
                    }
                });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Me error' });
            }
        });
    }
}
module.exports = new authController();
