import express from 'express'
import {v1} from "uuid";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const mysql = require('mysql')
const app = express()
const PORT = process.env.PORT || 7542;

const endPoints = {
    startPage: '/',
    me: '/auth/me',
    registration: '/auth/register',
    login: '/auth/login',
    logout: '/auth/me'
}

const connection = mysql.createConnection({
    host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '479ukXTghZsCFgw.root',
    password: '2kcSGnAulyiZ0Jj2',
    database: 'test',
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
});


// Mock user database
type UsersType = {
    userId: string
    email: string
    firstName: string
    lastName: string
    password: string
}
const users:UsersType[] = [];


connection.connect((err: any) => {
    if (err) {
        return console.log(JSON.stringify(err))
    } else {
        return console.log('Подключение успешно')
    }
})

const corsOptions = {
    origin: (origin: any, callback: any) => {
        console.log("origin: ", origin);
        callback(null, true);
    },
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

const jsonBodyMiddleWare = express.json()
app.use(jsonBodyMiddleWare)


app.get(endPoints.startPage, (req, res) => {
    res.json({message: "hi from Express App"})
    return console.log('Соединение закрыто')
})

app.post(endPoints.registration, async (req, res) => {
    const { firstName, lastName, email, password, } = req.body;
    // Check if user already exists
    const userExists = users.find((user) => user.email === email);
    if (userExists) {
        return res.status(409).json({ message: 'User already exists' });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = v1()
    // Save the user to the database
    const user = { userId, firstName, lastName, email, password: hashedPassword };
    users.push(user);
    res.status(201).json({ message: 'User registered successfully' });
    return console.log('Соединение закрыто')
})


app.post(endPoints.login, async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = users.find((user) => user.email === email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ email }, 'secret');

    res.status(200).json({ message: 'Logged in successfully', token });
    return console.log('Соединение закрыто')
})


app.get(endPoints.me, (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized in token' });
    }

    try {
        const decodedToken = jwt.verify(token, 'secret');
        const email = decodedToken.email;

        const user = users.find((user) => user.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized in user' });
        }

        res.status(200).json({ email });
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized in catch' });
    }
});


app.listen(PORT, () => {
    console.log(`I started listening port: ${PORT}`)
})
