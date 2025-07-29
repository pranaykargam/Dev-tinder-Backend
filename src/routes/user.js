//  userRouter
// - GET /user/requests
// - GET /user/connections
// - GET /user /feed - Gets you the profiles of other users on platform


const express = require("express");
const { UserAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age skills about";

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

userRouter.get("/user/connections",UserAuth,async(req,res)=>{
    try{
      const loggedInUser = req.user;
      const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested",
      }).populate("fromUserId", USER_SAFE_DATA);
      
      const data = connectionRequests.map ((row)=> row.fromUserId) 

        res.json({data}); 
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})



module.exports = userRouter;

