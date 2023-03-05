import {connection} from "./index";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator')


class authController {
    async registration(req: any, res: any) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }
            const {firstName, lastName, email, password} = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const userExistsQuery = `SELECT * FROM Users WHERE email = '${email}'`;
            const userRegisterQuery = `INSERT INTO Users (email, first_name, last_name, avatar_url, role, password_hash) VALUES ('${email}', '${firstName}', '${lastName}', '', 'user', '${hashedPassword}')`;
            connection.query(userExistsQuery, (error: any, results: any) => {
                if (error) throw error;
                if (results.length === 1) {
                    return res.status(409).json({message: 'User already exists'});
                } else (
                    connection.query(userRegisterQuery, (error: any, results: any) => {
                        if (error) throw error;
                        res.status(201).json({message: 'User registered successfully'});
                    })
                )
            });
            return console.log('Соединение закрыто')
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req: any, res: any) {
        try {
            const {email, password} = req.body;
            const token = jwt.sign({email}, 'secret');
            const query = `SELECT * FROM Users WHERE email = '${email}'`;
            connection.query(query, (error: any, results: any) => {
                if (error) throw error;
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
                    bcrypt.compare(password, user.password_hash, (error: any, match: any) => {
                        if (error) throw error;
                        if (match) {
                            res.cookie('token', token, {
                                expires: new Date(Date.now() + (3600 * 1000 * 24 * 180 * 1)),
                                sameSite: 'none',
                                secure: "true",
                                httpOnly: true,
                            })
                            res.status(200).json({message: 'Login successful', user: userData});
                        } else {
                            return res.status(401).json({message: 'Incorrect email or password'});
                        }
                    });
                } else {
                    return res.status(401).json({message: 'Incorrect email or password'});
                }
            });
            return console.log('Соединение закрыто')
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async logout(req: any, res: any) {
        try {
            res.cookie('token', "", {
                expires: new Date(0),
                sameSite: 'none',
                secure: "true",
                httpOnly: true,
            })
            res.status(200).json({message: 'Logout successful'});
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Logout error'})
        }
    }

    async me(req: any, res: any) {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({message: 'Unauthorized in token', token});
            }
            const decodedToken = jwt.verify(token, 'secret');
            const email = decodedToken.email;
            // Find user
            const userExistsQuery = `SELECT * FROM Users WHERE email = '${email}'`;
            connection.query(userExistsQuery, (error: any, results: any) => {
                if (error) throw error;
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
                    return res.status(200).json({email: email, user: userData});
                } else {
                    return res.status(401).json({message: 'Unauthorized in user'});
                }
            });
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Me error'})
        }
    }

}

module.exports = new authController()