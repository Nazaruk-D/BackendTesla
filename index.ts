import express from 'express'
const cors = require('cors')
const app = express()
const mysql = require('mysql')
const cookieParser = require('cookie-parser')
const authRouter = require('./authRouter')
const profileRouter = require('./profileRouter')
const demoDriveRouter = require('./demoDriveRouter')
const PORT = process.env.PORT || 7542;

export const connection = mysql.createConnection({
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

const corsOptions = {
    origin: (origin: any, callback: any) => {
        console.log("origin: ", origin);
        callback(null, true);
    },
    credentials: true,
    optionSuccessStatus: 200
}
const jsonBodyMiddleWare = express.json()

app.use(jsonBodyMiddleWare)
app.use(cors(corsOptions));
app.use(cookieParser('secret key'))
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/demo-drive', demoDriveRouter);


app.get("/", (req, res) => {
    res.json({message: "hi from Express App"})
    return console.log('Соединение закрыто')
})


app.listen(PORT, () => {
    console.log(`I started listening port: ${PORT}`)
})
