const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const { connectDB } = require('./config/database')

const app = express()

connectDB().then(() => {
    console.log("Databse connected successfully!")
    app.listen(process.env.PORT, () => {
        console.log(`Server running on ${process.env.PORT}`)
    })
}).catch(() => {
    console.log("Dabase connection failed!!")
})
