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
                                res.status(200).send({ message: 'User updated successfully', /*user: userData*/ });
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
