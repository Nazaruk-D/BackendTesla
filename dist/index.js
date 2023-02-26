"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const cors = require('cors');
const mysql = require('mysql');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 7542;
const endPoints = {
    startPage: '/',
    lengthTable: '/length',
    listOfLetters: '/allLetters',
    createMessage: '/sendMessage',
    deleteMessage: '/deleteMessage/:id'
};
const connection = mysql.createConnection({
    host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '4AfZkWpmjEUaTXa.root',
    password: 'YKY0nwjX0Ho0R5xo',
    database: 'letters',
    // database: 'test',
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
});
connection.connect((err) => {
    if (err) {
        // return console.log('Ошибка подключения к БД')
        return console.log(JSON.stringify(err));
    }
    else {
        return console.log('Подключение успешно');
    }
});
const corsOptions = {
    origin: (origin, callback) => {
        // if(whitelist.includes(origin || ""))
        //     return callback(null, true)
        //
        // callback(new Error('Not allowed by CORS'));
        console.log("origin: ", origin);
        callback(null, true); // everyone is allowed
    },
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));
const jsonBodyMiddleWare = express_1.default.json();
app.use(jsonBodyMiddleWare);
app.get(endPoints.startPage, (req, res) => {
    res.json({ message: "hi from Express App" });
    return console.log('Соединение закрыто');
});
app.get(endPoints.lengthTable, (req, res) => {
    const allLetters = "SELECT * FROM letters";
    connection.query(allLetters, (err, resDB) => {
        res.status(200).json(resDB.length);
        return console.log('Соединение закрыто');
    });
});
app.get(endPoints.listOfLetters, (req, res) => {
    const allLetters = "SELECT * FROM letters";
    connection.query(allLetters, (err, resDB) => {
        res.status(200).json(resDB);
        return console.log('Соединение закрыто');
    });
});
app.post(endPoints.createMessage, (req, res) => {
    let newId = (0, uuid_1.v1)();
    let allLetters = "INSERT INTO `letters`(`id`, `age`, `email`, `name`, `content`, `underTree`) VALUES('" + newId + "', '" + req.body.age + "', '" + req.body.email + "', '" + req.body.name + "', '" + req.body.content + "', '" + req.body.underTree + "')";
    connection.query(allLetters, (err, resDB) => {
        const newLetter = {
            "id": newId,
            "age": req.body.age,
            "email": req.body.email,
            "name": req.body.name,
            "text": req.body.content,
            "underTree": req.body.underTree
        };
        res.status(201).json(newLetter);
        return console.log('Соединение закрыто');
    });
});
app.delete(endPoints.deleteMessage, (req, res) => {
    let deleteMessage = "DELETE FROM `letters` WHERE `id` = '" + req.params.id + "' ";
    connection.query(deleteMessage, (err, resDB) => {
        res.status(200).json("Сообщение удалено");
        return console.log('Соединение закрыто');
    });
});
app.listen(PORT, () => {
    console.log(`I started listening port: ${PORT}`);
});
