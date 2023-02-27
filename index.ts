import express from 'express'
const cors = require('cors')
const mysql = require('mysql')
const app = express()
const cookieParser = require('cookie-parser')
const authRouter = require('./authRouter')
const PORT = process.env.PORT || 7542;


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



app.get("/", (req, res) => {
    res.json({message: "hi from Express App"})
    return console.log('Соединение закрыто')
})


app.listen(PORT, () => {
    console.log(`I started listening port: ${PORT}`)
})
