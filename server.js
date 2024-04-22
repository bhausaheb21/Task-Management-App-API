const express = require('express')
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const { authRouter, taskRouter } = require('./Routes');
const rateLimit = require('express-rate-limit')
require('dotenv').config()
// User

const PORT = process.env.PORT || 8000;

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
  });


app.use(cors());
app.use(limiter)
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
    try {

        await mongoose.connect(process.env.DATABASE_URL)
        console.log("Connected to Database");
        app.listen(PORT, () => {
            console.log(`Listening to Port ${PORT} `);
        })
    }
    catch (err) {

    }
}

startServer()

