import {connection} from "./index";
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
    async updateUser(req: any, res: any) {
        try {
            const {id, firstName, lastName, email, region, phoneNumber} = req.body;
            const regionIdQuery = `SELECT id FROM Regions WHERE region='${region}'`;

            connection.query(regionIdQuery, (error: any, results: any) => {
                if (error) throw error;

                if (results.length === 1) {
                    const regionId = results[0].id;
                    const updateUserQuery = `UPDATE Users SET first_name='${firstName}', last_name='${lastName}', email='${email}', region_id=${regionId}, phone_number=${phoneNumber}, updated_at=CURRENT_TIMESTAMP WHERE id=${id}`;

                    connection.query(updateUserQuery, (error: any, results: any) => {
                        if (error) {
                            return res.status(500).send({error: 'Error updating user', statusCode: 500});
                        } else {
                            const getUserQuery = `SELECT u.*, r.region FROM Users u INNER JOIN Regions r ON u.region_id = r.id WHERE email = '${email}'`;
                            connection.query(getUserQuery, (error: any, results: any) => {
                                if (error) throw error;
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
                                    return res.status(200).send({message: 'User updated successfully', user: userData, statusCode: 200});
                                } else {
                                    return res.status(401).json({message: 'Unauthorized in user', statusCode: 401});
                                }
                            });
                        }
                    });
                } else {
                    return res.status(400).json({message: 'Region search error', statusCode: 400})
                }
            })
            return console.log('Соединение закрыто')
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Update data error', statusCode: 400})
        }
    }

    async updateScheduleStatus (req: any, res: any) {
        try {
            const {id, status} = req.body;
            console.log(id, status)
            console.log(req.body)
            const updateStatusQuery = `UPDATE Orders SET status='${status}', updated_at=CURRENT_TIMESTAMP WHERE id=${id}`;

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
    async resetPassword(req: any, res: any) {
        try {
            const {id, password} = req.body;

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const updateUserPasswordQuery = `UPDATE Users SET password_hash='${hashedPassword}', updated_at=CURRENT_TIMESTAMP WHERE id=${id}`;
            connection.query(updateUserPasswordQuery, (error: any, results: any) => {
                if (error) {
                    return res.status(500).json({message: 'Error updating user password', statusCode: 500});
                } else {
                    return res.status(200).send({message: 'User password updated successfully', statusCode: 200});
                }
            })
            return console.log('Соединение закрыто')
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Update data error', statusCode: 400})
        }
    }

    async getUsers(req: any, res: any) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;

            const totalCountQuery = `SELECT COUNT(*) as totalCount FROM Users;`;

            connection.query(totalCountQuery, (error: any, results: any) => {
                if (error) {
                    return res.status(400).json({message: 'Error getting total count', statusCode: 400});
                } else {
                    const totalCount = results[0].totalCount;
                    const getUsersQuery = `SELECT email, first_name as firstName, last_name as lastName, role, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as createdAt, DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt FROM Users LIMIT ${startIndex}, ${limit};`;

                    connection.query(getUsersQuery, (error: any, results: any) => {
                        if (error) {
                            return res.status(400).json({message: 'Error getting users', statusCode: 400});
                        } else {
                            const users = results;
                            const usersData: any = {};
                            usersData.totalUsersCount = totalCount;
                            usersData.currentPage = page;
                            usersData.users = users;
                            return res.status(200).send({message: 'Getting users successfully', data: usersData, statusCode: 200});
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

    async getSchedules(req: any, res: any) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const totalCountQuery = `SELECT COUNT(*) as totalCount FROM Orders;`;

            connection.query(totalCountQuery, (error: any, results: any) => {
                if (error) {
                    return res.status(400).json({message: 'Error getting total schedule count', statusCode: 400});
                } else {
                    const totalCount = results[0].totalCount;
                    const getScheduleQuery = `SELECT o.*, o.contact_preference AS contactPreference, DATE_FORMAT(o.created_at, '%Y-%m-%d %H:%i:%s') as createdAt, DATE_FORMAT(o.updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt, u.first_name AS firstName, u.last_name AS lastName, u.phone_number AS phoneNumber, u.email AS email, v.vehicle AS model FROM Orders o JOIN Users u ON o.user_id = u.id JOIN Vehicles v ON o.vehicle_id = v.id LIMIT ${startIndex}, ${limit};`;
                    // const getScheduleQuery = `SELECT * FROM Orders`;
                    connection.query(getScheduleQuery, (error: any, results: any) => {
                        if (error) {
                            return res.status(400).json({message: 'Error getting schedules', statusCode: 400});
                        } else {
                            const orders = results;
                            const ordersData: any = {};
                            ordersData.totalScheduleCount = totalCount;
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

    async deleteUser(req: any, res: any) {
        try {
            const {email} = req.body

            const deleteQuery = `DELETE FROM Users WHERE email='${email}';`;

            connection.query(deleteQuery, (error: any, results: any) => {
                if (error) {
                    return res.status(400).json({message: 'Delete user error', statusCode: 400});
                } else {
                    return res.status(200).json({message: 'User deleted successfully', statusCode: 200});
                }
            });

            return console.log('Соединение закрыто')
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Get users error', statusCode: 400})
        }
    }
}

module.exports = new profileController()