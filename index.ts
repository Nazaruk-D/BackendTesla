import express from 'express'
import {v1} from "uuid";

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
    user: '4AfZkWpmjEUaTXa.root',
    password: 'YKY0nwjX0Ho0R5xo',
    database: 'letters',
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
})


connection.connect((err: any) => {
    if (err) {
        // return console.log('Ошибка подключения к БД')
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


app.get(endPoints.me, (req, res) => {
    res.status(200).json({message: "response me request"})
    return console.log('Соединение закрыто')
})

app.post(endPoints.login, (req, res) => {
    res.status(200).json({message: JSON.stringify(req.body)})
    return console.log('Соединение закрыто')
})



app.listen(PORT, () => {
    console.log(`I started listening port: ${PORT}`)
})
