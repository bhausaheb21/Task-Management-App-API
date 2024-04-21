const express = require('express')
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const { authRouter, taskRouter } = require('./Routes');
const { User } = require('./Models');
require('dotenv').config()
// User

const PORT = process.env.PORT || 8000;

const app = express();


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use('/auth', authRouter)
app.use(taskRouter)

//error handling middleware which is executed last

app.use((err, req, res, next) => {
    let status = 500;
    console.log(err);
    let message = "Internal Server Error";
    if (err.status) {
        status = err.status;
        message = err.message;
    }
    res.status(status).json({ error: message })
})


const startServer = async () => {
    try{

        await mongoose.connect(process.env.DATABASE_URL)
        console.log("Connected to Database");
        app.listen(PORT, () => {
            console.log(`Listening to Port ${PORT} `);
        })
    }
    catch(err){

    }
}

startServer()

