const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending"
        },
        priority: {
            type: Number,
        },
        completed_time: {
            type: Date
        },
        due_date: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: (obj, ret) => {
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
            }
        }
    })

module.exports = mongoose.model('Tasks', TaskSchema)