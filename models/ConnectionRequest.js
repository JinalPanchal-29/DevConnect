const mongoose = require('mongoose');
const { Schema } = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['interested', 'ignored', 'accepted', 'rejected'],
            message: '{VALUE} is not supported'
        },
        required: true
    }
}, {
    timestamps: true
})

connectionRequestSchema.pre('save', async function () {
    const connectionRequest = this;

    const existingRequest = await mongoose.model('ConnectionRequest').findOne({
        $or: [
            { fromUserId: connectionRequest.fromUserId, toUserId: connectionRequest.toUserId },
            { fromUserId: connectionRequest.toUserId, toUserId: connectionRequest.fromUserId }
        ],
        _id: { $ne: connectionRequest._id }
    })

    if (existingRequest) {
        throw new Error('Connection request already exists!')
    }
})



const ConnectionRequest = mongoose.model(
    'ConnectionRequest',
    connectionRequestSchema
);

module.exports = ConnectionRequest;
