const express = require('express');
const auth = require('../middleware/auth');
const ConnectionRequest = require('../models/ConnectionRequest')
const User = require('../models/User')

const requestRouter = express.Router();

requestRouter.post('/send/:status/:userId', auth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { status, userId: toUserId } = req.params;

    const allowedStatuses = ['interested', 'ignored'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status type'
      });
    }

    if (fromUserId.toString() === toUserId.toString()) {
      return res.status(400).json({
        message: 'Cannot send request to yourself'
      });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check if there is an existing connection request
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (existingConnectionRequest) {
      return res.status(400).json({ message: 'Connection request already exists!' });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId, toUserId, status
    })

    await connectionRequest.save()

    res.status(201).json({
      message: `Request ${status} successfully!`
    })

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
})

requestRouter.post('/review/:status/:requestId', auth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { status, requestId } = req.params

    const allowedStatuses = [
      'accepted',
      'rejected'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: 'interested'
    })

    if (!connectionRequest) {
      return res.status(404).json({ message: 'No connection request found' })
    }

    connectionRequest.status = status;
    await connectionRequest.save();
    res.status(200).json({
      message: `Connection request ${status} successfully`,
      data: connectionRequest
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
})

module.exports = requestRouter;
