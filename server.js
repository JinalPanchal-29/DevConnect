const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const connectDB = require('./config/database')

const app = express()

app.use(express.json())

app.post('/signup', (req, res) => {
    console.log(req.body)
    res.send("Sign up called")
})

connectDB().then(() => {
    console.log("Databse connected successfully!")
    app.listen(process.env.PORT, () => {
        console.log(`Server running on ${process.env.PORT}`)
    })
}).catch(() => {
    console.log("Dabase connection failed!!")
})
