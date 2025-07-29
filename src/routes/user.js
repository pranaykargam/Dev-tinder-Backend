//  userRouter
// - GET /user/requests
// - GET /user/connections
// - GET /user /feed - Gets you the profiles of other users on platform


const express = require("express");
const { UserAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

// Getting all the pending connection request for the logged-in user 
userRouter.get("/user/requests/received",UserAuth, async (req, res) => {
  try{
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested"
    }).populate("fromUserId", "firstName lastName age gender about skills")

    res.json({
      message: "Data fetched successfully",
      data: connectionRequest,
    });

  }catch(err){
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;

