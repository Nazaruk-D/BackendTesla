import {connection} from "./index";
const bcrypt = require('bcrypt');

class profileController {
    async updateUser (req: any, res: any) {
        try {
            const {id, firstName, lastName, email, region, phoneNumber} = req.body;
            const regionIdQuery = `SELECT id FROM Regions WHERE region=${region}`;

            connection.query(regionIdQuery, (error: any, results: any) => {
                if (error) throw error;

                if (results.length === 1) {
                    const regionId = results[0].id;
                    const updateUserQuery = `UPDATE Users SET first_name=${firstName}, last_name=${lastName}, email=${email}, region_id=${regionId}, phone_number=${phoneNumber} WHERE id=${id}`;

                    connection.query(updateUserQuery, (error: any, results: any) => {
                        if (error) {
                            return res.status(500).send({ error: 'Error updating user' });
                        } else {
                            res.send({ message: 'User updated successfully' });
                        }
                    });
                }
                else {
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