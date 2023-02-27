"use strict";
// import {v1} from "uuid";
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const {validationResult} = require('express-validator')
//
//
// // Mock user database
// type UsersType = {
//     userId: string
//     email: string
//     firstName: string
//     lastName: string
//     password: string
// }
// const users: UsersType[] = [];
//
// class authController {
//     async registration(req: any, res: any) {
//         try {
//             const errors = validationResult(req)
//             if(!errors.isEmpty()) {
//                 return res.status(400).json({message: "Ошибка при регистрации", errors})
//             }
//             const {firstName, lastName, email, password,} = req.body;
//             // Check if user already exists
//             const userExists = users.find((user) => user.email === email);
//             if (userExists) {
//                 return res.status(409).json({message: 'User already exists'});
//             }
//             // Hash the password
//             const salt = await bcrypt.genSalt(10);
//             const hashedPassword = await bcrypt.hash(password, salt);
//             const userId = v1()
//             // Save the user to the database
//             const user = {userId, firstName, lastName, email, password: hashedPassword};
//             users.push(user);
//             res.status(201).json({message: 'User registered successfully'});
//             return console.log('Соединение закрыто')
//         } catch (e) {
//             console.log(e)
//             res.status(400).json({message: 'Registration error'})
//         }
//     }
//
//     async login(req: any, res: any) {
//         try {
//             const {email, password} = req.body;
//             const user = users.find((user) => user.email === email);
//             if (!user) {
//                 return res.status(401).json({message: 'Invalid credentials'});
//             }
//             const passwordMatch = await bcrypt.compare(password, user.password);
//             if (!passwordMatch) {
//                 return res.status(401).json({message: 'Invalid credentials'});
//             }
//             const token = jwt.sign({email}, 'secret');
//             res.cookie('token', token, {
//                 expires: new Date(Date.now() + (3600 * 1000 * 24 * 180 * 1)),
//                 httpOnly: true,
//                 sameSite: "none",
//                 secure: "false",
//             })
//             res.status(200).json({message: 'Logged in successfully', token});
//             return console.log('Соединение закрыто')
//         } catch (e) {
//             console.log(e)
//             res.status(400).json({message: 'Login error'})
//         }
//     }
//
//     async logout(req: any, res: any) {
//         try {
//             res.json("server work")
//         } catch (e) {
//             console.log(e)
//             res.status(400).json({message: 'Logout error'})
//         }
//     }
//
//     async me(req: any, res: any) {
//         try {
//             const token = req.cookies.token;
//             if (!token) {
//                 return res.status(401).json({message: 'Unauthorized in token', token});
//             }
//             const decodedToken = jwt.verify(token, 'secret');
//             const email = decodedToken.email;
//             const user = users.find((user) => user.email === email);
//             if (!user) {
//                 return res.status(401).json({message: 'Unauthorized in user'});
//             }
//             res.status(200).json({email});
//         } catch (e) {
//             console.log(e)
//             res.status(400).json({message: 'Me error'})
//         }
//     }
// }
//
// module.exports = new authController()
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const mysql = require('mysql');
const connection = mysql.createConnection({
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
connection.connect((err) => {
    if (err) {
        return console.log(JSON.stringify(err));
    }
    else {
        return console.log('Подключение успешно');
    }
});
const users = [];
class authController {
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Ошибка при регистрации", errors });
                }
                const { firstName, lastName, email, password } = req.body;
                const salt = yield bcrypt.genSalt(10);
                const hashedPassword = yield bcrypt.hash(password, salt);
                const userExistsQuery = `SELECT * FROM Users WHERE email = '${email}'`;
                const userRegisterQuery = `INSERT INTO Users (email, first_name, last_name, avatar_url, role, password_hash) VALUES ('${email}', '${firstName}', '${lastName}', '', 'user', '${hashedPassword}')`;
                connection.query(userExistsQuery, (error, results) => {
                    if (error)
                        throw error;
                    if (results.length === 1) {
                        return res.status(409).json({ message: 'User already exists' });
                    }
                    else
                        (connection.query(userRegisterQuery, (error, results) => {
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
                connection.query(query, (error, results) => {
                    if (error)
                        throw error;
                    if (results.length === 1) {
                        const user = results[0];
                        bcrypt.compare(password, user.password_hash, (error, match) => {
                            if (error)
                                throw error;
                            if (match) {
                                res.cookie('token', token, {
                                    expires: new Date(Date.now() + (3600 * 1000 * 24 * 180 * 1)),
                                    httpOnly: true,
                                    sameSite: "none",
                                    secure: "false",
                                });
                                res.status(200).json({ message: 'Login successful' });
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
