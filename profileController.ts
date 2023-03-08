import {connection} from "./index";

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
                            return res.status(500).send({error: 'Error updating user'});
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
                                        createdAt: user.created_at,
                                        updatedAt: user.updated_at
                                    };
                                    return res.status(200).send({message: 'User updated successfully', user: userData});
                                } else {
                                    return res.status(401).json({message: 'Unauthorized in user'});
                                }
                            });
                        }
                    });
                } else {
                    return res.status(400).json({message: 'Region search error'})
                }
            })
            return console.log('Соединение закрыто')
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Update data error'})
        }
    }
}

module.exports = new profileController()