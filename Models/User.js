const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        tasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref :"Tasks"
        }]
    },
    {
        timestamps: true,
        toJSON: {
            transform: (obj, ret) => {
                delete ret.__v;
                delete ret.password;
                delete ret.salt;
                delete ret.createdAt;
                delete ret.updatedAt;
            }
        }
    })

module.exports = mongoose.model('User', userSchema)