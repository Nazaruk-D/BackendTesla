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
class profileController {
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, firstName, lastName, email, region, phoneNumber } = req.body;
                const regionIdQuery = `SELECT id FROM Regions WHERE region=${region}`;
                index_1.connection.query(regionIdQuery, (error, results) => {
                    if (error)
                        throw error;
                    if (results.length === 1) {
                        const regionId = results[0].id;
                        const updateUserQuery = `UPDATE Users SET first_name=${firstName}, last_name=${lastName}, email=${email}, region_id=${regionId}, phone_number=${phoneNumber}, updated_at=CURRENT_TIMESTAMP WHERE id=${id}`;
                        index_1.connection.query(updateUserQuery, (error, results) => {
                            if (error) {
                                return res.status(500).send({ error: 'Error updating user' });
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
                                            createdAt: user.created_at,
                                            updatedAt: user.updated_at
                                        };
                                        return res.status(200).send({ message: 'User updated successfully', user: userData });
                                    }
                                    else {
                                        return res.status(401).json({ message: 'Unauthorized in user' });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        return res.status(400).json({ message: 'Region search error' });
                    }
                });
                return console.log('Соединение закрыто');
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Update data error' });
            }
        });
    }
}
module.exports = new profileController();
