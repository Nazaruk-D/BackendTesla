import {v1} from "uuid";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator')


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
            const {firstName, lastName, email, password,} = req.body;
            // Check if user already exists
            const userExists = users.find((user) => user.email === email);
            if (userExists) {
                return res.status(409).json({message: 'User already exists'});
            }
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const userId = v1()
            // Save the user to the database
            const user = {userId, firstName, lastName, email, password: hashedPassword};
            users.push(user);
            res.status(201).json({message: 'User registered successfully'});
            return console.log('Соединение закрыто')
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req: any, res: any) {
        try {
            const {email, password} = req.body;
            const user = users.find((user) => user.email === email);
            if (!user) {
                return res.status(401).json({message: 'Invalid credentials'});
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({message: 'Invalid credentials'});
            }
            const token = jwt.sign({email}, 'secret');
            // res.cookie('token', token)
            // res.cookie('token', token, { httpOnly: true, domain: process.env.NODE_ENV === 'development' ? '.localhost' : '.domain.com' })
            res.cookie('token', token, { httpOnly: true })
            res.status(200).json({message: 'Logged in successfully', token});
            return console.log('Соединение закрыто')
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async logout(req: any, res: any) {
        try {
            res.json("server work")
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