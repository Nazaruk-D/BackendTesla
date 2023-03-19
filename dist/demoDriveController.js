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
class demoDriveController {
    updateDemoDriveStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, status } = req.body;
                console.log(id, status);
                console.log(req.body);
                const updateStatusQuery = `UPDATE Orders SET status='${status}', updated_at=CURRENT_TIMESTAMP WHERE id=${id}`;
                index_1.connection.query(updateStatusQuery, (error, results) => {
                    if (error) {
                        return res.status(500).send({ message: 'Error updating schedule order status', statusCode: 500 });
                    }
                    else {
                        return res.status(201).send({ message: 'User updated successfully', statusCode: 201 });
                    }
                });
                return console.log('Соединение закрыто');
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Update error', statusCode: 400 });
            }
        });
    }
    getDemoDriveOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const startIndex = (page - 1) * limit;
                const totalCountQuery = `SELECT COUNT(*) as totalCount FROM Orders;`;
                index_1.connection.query(totalCountQuery, (error, results) => {
                    if (error) {
                        return res.status(400).json({ message: 'Error getting total schedule count', statusCode: 400 });
                    }
                    else {
                        const totalCount = results[0].totalCount;
                        const getScheduleQuery = `SELECT o.*, o.contact_preference AS contactPreference, DATE_FORMAT(o.created_at, '%Y-%m-%d %H:%i:%s') as createdAt, DATE_FORMAT(o.updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt, u.first_name AS firstName, u.last_name AS lastName, u.phone_number AS phoneNumber, u.email AS email, v.vehicle AS model FROM Orders o JOIN Users u ON o.user_id = u.id JOIN Vehicles v ON o.vehicle_id = v.id LIMIT ${startIndex}, ${limit};`;
                        index_1.connection.query(getScheduleQuery, (error, results) => {
                            if (error) {
                                return res.status(400).json({ message: 'Error getting schedules', statusCode: 400 });
                            }
                            else {
                                const orders = results;
                                const ordersData = {};
                                ordersData.totalDemoDriveOrdersCount = totalCount;
                                ordersData.currentPage = page;
                                ordersData.orders = orders;
                                return res.status(200).send({ message: 'Getting schedule successfully', data: ordersData, statusCode: 200 });
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
module.exports = new demoDriveController();
