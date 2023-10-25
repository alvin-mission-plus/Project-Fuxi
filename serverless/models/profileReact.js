const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const schema = new Schema(
    {
        profileId: {
            type: Types.ObjectId,
            unique: true,
            required: true,
        },
        reactTracks: [
            {
                track: {
                    type: Types.ObjectId,
                    ref: 'tracks',
                    required: true,
                },
                preference: {
                    type: String,
                    enum: ['strongly dislike', 'dislike', 'neutral', 'like', 'strongly like'],
                    default: 'neutral',
                },
            },
        ],
    },
    { versionKey: false },
);
schema.index({ profileId: 1 });

module.exports = model('profileReact', schema);
