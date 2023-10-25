const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const schema = new Schema(
    {
        uid: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        yearBirth: {
            type: Date,
            required: true,
        },
        genres: [
            {
                type: String,
                required: true,
            },
        ],
        description: {
            type: String,
        },
    },
    { timestamps: true },
);
schema.index({ uid: 1 });

module.exports = model('profiles', schema);
