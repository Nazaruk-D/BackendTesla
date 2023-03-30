import {connection} from "./index";

class demoDriveController {
    async updateDemoDriveStatus (req: any, res: any) {
        try {
            const {id, status} = req.body;

            const updateStatusQuery = `UPDATE Demo_orders SET status='${status}', updated_at=CURRENT_TIMESTAMP WHERE id=${id}`;

            connection.query(updateStatusQuery, (error: any, results: any) => {
                if (error) {
                    return res.status(500).send({message: 'Error updating schedule order status', statusCode: 500});
                } else {
                    return res.status(201).send({message: 'User updated successfully', statusCode: 201});
                }
            });
            return console.log('Соединение закрыто')
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Update error', statusCode: 400})
        }
    }

    async getDemoDriveOrders(req: any, res: any) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const totalCountQuery = `SELECT COUNT(*) as totalCount FROM Demo_orders;`;

            connection.query(totalCountQuery, (error: any, results: any) => {
                if (error) {
                    return res.status(400).json({message: 'Error getting total schedule count', statusCode: 400});
                } else {
                    const totalCount = results[0].totalCount;
                    const getScheduleQuery = `SELECT o.*, o.contact_preference AS contactPreference, DATE_FORMAT(o.created_at, '%Y-%m-%d %H:%i:%s') as createdAt, DATE_FORMAT(o.updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt, u.first_name AS firstName, u.last_name AS lastName, u.phone_number AS phoneNumber, u.email AS email, v.vehicle AS model FROM Orders o JOIN Users u ON o.user_id = u.id JOIN Vehicles v ON o.vehicle_id = v.id LIMIT ${startIndex}, ${limit};`;
                    connection.query(getScheduleQuery, (error: any, results: any) => {
                        if (error) {
                            return res.status(400).json({message: 'Error getting schedules', statusCode: 400});
                        } else {
                            const orders = results;
                            const ordersData: any = {};
                            ordersData.totalDemoDriveOrdersCount = totalCount;
                            ordersData.currentPage = page;
                            ordersData.orders = orders;
                            return res.status(200).send({message: 'Getting schedule successfully', data: ordersData, statusCode: 200});
                        }
                    });
                }
            });
            return console.log('Соединение закрыто')
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Get users error', statusCode: 400})
        }
    }

    async createDemoDriveOrder(req: any, res: any) {
        try {
            const {email, firstName, lastName, contactPreference, phoneNumber, region, zipCode, model} = req.body;
            const userExistsQuery = `SELECT * FROM Users WHERE email = '${email}'`;

            connection.query(userExistsQuery, (error: any, results: any) => {
                if (error) throw error;

                if (results.length === 1) {
                    const user = results[0];
                    const regionIdQuery = `SELECT id FROM Regions WHERE region='${region}'`;

                    connection.query(regionIdQuery, (error: any, results: any) => {
                        if (error) throw error;

                        if (results.length === 1) {
                            const regionId = results[0].id;
                            const updateUserQuery = `UPDATE Users SET first_name='${firstName}', last_name='${lastName}', phone_number='${phoneNumber}', region_id=${regionId}, updated_at=CURRENT_TIMESTAMP WHERE email='${email}'`;

                            connection.query(updateUserQuery, (error: any, results: any) => {

                                if (error) {
                                    return res.status(500).send({error: 'Error updating user', statusCode: 500});
                                } else {
                                    const vehicleIdQuery = `SELECT id FROM Vehicles WHERE vehicle='${model}'`;
                                    connection.query(vehicleIdQuery, (error: any, results: any) => {
                                        if (error) throw error;

                                        if (results.length === 1) {
                                            const vehicleId = results[0].id;
                                            //добавить zipCode
                                            const createOrderQuery = `INSERT INTO Demo_orders (user_id, vehicle_id, contact_preference) VALUES (${user.id}, ${vehicleId}, '${contactPreference}')`;

                                            connection.query(createOrderQuery, (error: any, results: any) => {
                                                if (error) {
                                                    return res.status(500).send({error: 'Error creating demo-drive order', statusCode: 500});
                                                } else {
                                                    return res.status(201).json({message: 'Demo-drive order created successfully', statusCode: 201});
                                                }
                                            })
                                        } else {
                                            return res.status(400).json({message: 'Vehicle search error', statusCode: 400})
                                        }
                                    })
                                }
                            })
                        }
                        else {
                            return res.status(400).json({message: 'Region search error', statusCode: 400})
                        }
                    })
                }
                else {
                    const regionIdQuery = `SELECT id FROM Regions WHERE region='${region}'`;
                    connection.query(regionIdQuery, (error: any, results: any) => {
                        if (error) throw error;

                        if (results.length === 1) {
                            const regionId = results[0].id;
                            const createUserQuery = `INSERT INTO Users (email, first_name, last_name, region_id, phone_number) VALUES ('${email}', '${firstName}', '${lastName}', ${regionId}, '${phoneNumber}');`;

                            connection.query(createUserQuery, (error: any, results: any) => {
                                if (error) {
                                    return res.status(500).send({error: 'Error creating user user', statusCode: 500});
                                } else {
                                    const vehicleIdQuery = `SELECT id FROM Vehicles WHERE vehicle='${model}'`;
                                    connection.query(vehicleIdQuery, (error: any, results: any) => {
                                        if (error) throw error;

                                        if (results.length === 1) {
                                            const vehicleId = results[0].id;

                                            connection.query(userExistsQuery, (error: any, results: any) => {
                                                if (results.length === 1) {
                                                    const userId = results[0].id;

                                                    // add zipCode
                                                    const createOrderQuery = `INSERT INTO Demo_orders (user_id, vehicle_id, contact_preference) VALUES (${userId}, ${vehicleId}, '${contactPreference}');`;
                                                    connection.query(createOrderQuery, (error: any, results: any) => {
                                                        if (error) {
                                                            return res.status(500).send({error: 'Error creating demo-drive order', statusCode: 500});
                                                        } else {
                                                            return res.status(201).json({message: 'Demo-drive order created successfully', statusCode: 201});
                                                        }
                                                    })
                                                } else {
                                                    return res.status(500).send({error: 'Error getting user id', statusCode: 500});
                                                }
                                            })
                                        } else {
                                            return res.status(400).json({message: 'Vehicle search error', statusCode: 400})
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            });
            return console.log('Соединение закрыто')
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Get users error', statusCode: 400})
        }
    }
}

module.exports = new demoDriveController()