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
// type UsersDataType = {
//     next: {
//         page: number
//         limit: number
//     },
//     previous: {
//         page: number
//         limit: number
//     },
//     totalCount: number,
//     currentPage: number,
//     users: []
// }
class profileController {
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, firstName, lastName, email, region, phoneNumber } = req.body;
                const regionIdQuery = `SELECT id FROM Regions WHERE region='${region}'`;
                index_1.connection.query(regionIdQuery, (error, results) => {
                    if (error)
                        throw error;
                    if (results.length === 1) {
                        const regionId = results[0].id;
                        const updateUserQuery = `UPDATE Users SET first_name='${firstName}', last_name='${lastName}', email='${email}', region_id=${regionId}, phone_number=${phoneNumber}, updated_at=CURRENT_TIMESTAMP WHERE id=${id}`;
                        index_1.connection.query(updateUserQuery, (error, results) => {
                            if (error) {
                                return res.status(500).send({ error: 'Error updating user', statusCode: 500 });
                            }
                            else {
                                const getUserQuery = `SELECT u.*, r.region FROM Users u INNER JOIN Regions r ON u.region_id = r.id WHERE email = '${email}'`;
                                index_1.connection.query(getUserQuery, (error, results) => {
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
                                            isRegistered: user.is_registered,
                                            createdAt: user.created_at,
                                            updatedAt: user.updated_at
                                        };
                                        return res.status(200).send({ message: 'User updated successfully', user: userData, statusCode: 200 });
                                    }
                                    else {
                                        return res.status(401).json({ message: 'Unauthorized in user', statusCode: 401 });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        return res.status(400).json({ message: 'Region search error', statusCode: 400 });
                    }
                });
                return console.log('Соединение закрыто');
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Update data error', statusCode: 400 });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, password } = req.body;
                const salt = yield bcrypt.genSalt(10);
                const hashedPassword = yield bcrypt.hash(password, salt);
                const updateUserPasswordQuery = `UPDATE Users SET password_hash='${hashedPassword}', updated_at=CURRENT_TIMESTAMP WHERE id=${id}`;
                index_1.connection.query(updateUserPasswordQuery, (error, results) => {
                    if (error) {
                        return res.status(500).json({ message: 'Error updating user password', statusCode: 500 });
                    }
                    else {
                        return res.status(200).send({ message: 'User password updated successfully', statusCode: 200 });
                    }
                });
                return console.log('Соединение закрыто');
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Update data error', statusCode: 400 });
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const startIndex = (page - 1) * limit;
                const totalCountQuery = `SELECT COUNT(*) as totalCount FROM Users;`;
                index_1.connection.query(totalCountQuery, (error, results) => {
                    if (error) {
                        return res.status(400).json({ message: 'Error getting total count', statusCode: 400 });
                    }
                    else {
                        const totalCount = results[0].totalCount;
                        const getUsersQuery = `SELECT email, first_name as firstName, last_name as lastName, role, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as createdAt, DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt FROM Users LIMIT ${startIndex}, ${limit};`;
                        index_1.connection.query(getUsersQuery, (error, results) => {
                            if (error) {
                                return res.status(400).json({ message: 'Error getting users', statusCode: 400 });
                            }
                            else {
                                const users = results;
                                const usersData = {};
                                usersData.totalUsersCount = totalCount;
                                usersData.currentPage = page;
                                usersData.users = users;
                                return res.status(200).send({ message: 'Getting users successfully', data: usersData, statusCode: 200 });
                            }
                        });
                    }
                });
                return console.log('Соединение закрыто');
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Get users error', statusCode: 400 });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const deleteQuery = `DELETE FROM Users WHERE email='${email}';`;
                index_1.connection.query(deleteQuery, (error, results) => {
                    if (error) {
                        return res.status(400).json({ message: 'Delete user error', statusCode: 400 });
                    }
                    else {
                        const getCountQuery = `SELECT COUNT(*) AS totalUsersCount FROM Users;`;
                        index_1.connection.query(getCountQuery, (error, results) => {
                            if (error) {
                                return res.status(400).json({ message: 'Error getting users count', statusCode: 400 });
                            }
                            else {
                                const totalUsersCount = results[0].totalUsersCount;
                                console.log(totalUsersCount);
                                return res.status(200).send({ message: 'User deleted successfully', totalUsersCount, statusCode: 200 });
                            }
                        });
                    }
                });
                return console.log('Соединение закрыто');
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Get users error', statusCode: 400 });
            }
        });
    }
}
module.exports = new profileController();
