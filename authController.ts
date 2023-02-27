const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator')
const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '479ukXTghZsCFgw.root',
    password: '2kcSGnAulyiZ0Jj2',
    database: 'carshop',
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
});
connection.connect((err: any) => {
    if (err) {
        return console.log(JSON.stringify(err))
    } else {
        return console.log('Подключение успешно')
    }
})

// Mock user database
type UsersType = {
    userId: string
    email: string
    firstName: string
    lastName: string
    password: string
}
const users: UsersType[] = [];

class authController {
    async registration(req: any, res: any) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }
            // Data destructuring
            const {firstName, lastName, email, password} = req.body;

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create queries
            const userExistsQuery = `SELECT * FROM Users WHERE email = '${email}'`;
            const userRegisterQuery = `INSERT INTO Users (email, first_name, last_name, avatar_url, role, password_hash) VALUES ('${email}', '${firstName}', '${lastName}', '', 'user', '${hashedPassword}')`;

            // Check if user already exists
            connection.query(userExistsQuery, (error: any, results: any) => {
                if (error) throw error;
                if (results.length === 1) {
                    return res.status(409).json({message: 'User already exists'});
                }
                else (
                    // Save the user to the database
                    connection.query(userRegisterQuery, (error: any, results: any) => {
                        if (error) throw error;
                        res.status(201).json({ message: 'User registered successfully' });
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

            // Create queries
            const query = `SELECT * FROM Users WHERE email = '${email}'`;

            // Check if user already exists
            connection.query(query, (error: any, results: any) => {
                if (error) throw error;

                if (results.length === 1) {
                    const user = results[0];

                    bcrypt.compare(password, user.password_hash, (error: any, match: any) => {
                        if (error) throw error;

                        if (match) {
                            res.cookie('token', token, {
                                expires: new Date(Date.now() + (3600 * 1000 * 24 * 180 * 1)),
                                httpOnly: true,
                                sameSite: "none",
                                secure: "false",
                            })
                            res.status(200).json({message: 'Login successful'});
                        }
                        else {
                            return res.status(401).json({message: 'Incorrect email or password'});
                        }
                    });
                }
                else {
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
            req.logout();
            res.clearCookie('token')
            res.redirect('/');
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
            const user = users.find((user) => user.email === email);
            if (!user) {
                return res.status(401).json({message: 'Unauthorized in user'});
            }
            res.status(200).json({email});
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Me error'})
        }
    }
}

module.exports = new authController()