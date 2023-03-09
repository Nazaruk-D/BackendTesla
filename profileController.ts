import {connection} from "./index";
const bcrypt = require('bcrypt');

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
    async resetPassword(req: any, res: any) {
        try {
            const {id, password} = req.body;

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const updateUserPasswordQuery = `UPDATE Users SET password_hash='${hashedPassword}', updated_at=CURRENT_TIMESTAMP WHERE id=${id}`;
            connection.query(updateUserPasswordQuery, (error: any, results: any) => {
                if (error) {
                    return res.status(500).json({message: 'Error updating user password'});
                } else {
                    return res.status(200).send({message: 'User password updated successfully'});
                }
            })
            return console.log('Соединение закрыто')
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Update data error', statusCode: 400})
        }
    }
}

module.exports = new profileController()