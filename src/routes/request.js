
const express = require("express");
const requestsRouter = express.Router();
const {UserAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user");
const mongoose = require("mongoose");


requestsRouter.post("/request/send/:status/:toUserId",UserAuth,async(req,res)=>{
 
 try {
   const fromUserId = req.user._id;
   
   const toUserId = req.params.toUserId;
   const status = req.params.status;


   // validate for the existance of userId in the DB
   const toUser = await User.findById(toUserId);
   if (!toUser) {
     return res.status(404).json({message: "User not found with ID: " + toUserId});
   }

   const allowedStatus = ["ignored", "interested"]
   if(!allowedStatus.includes(status)){
    return res.status(400).json({message:"Invalid status type:" +status
    })
   }

 


// Validate that fromUserId and toUserId are not the same
const existingConnectionRequest = await ConnectionRequest.findOne({
  $or: [
    { fromUserId, toUserId },
    { fromUserId: toUserId, toUserId: fromUserId }
  ],
});
if (existingConnectionRequest) {
  return res.status(400).send({message: "Connection request already exists !!"});
}


   const connectionRequest = new ConnectionRequest({
    fromUserId,
    toUserId,
    status//nothing but intrested and rejected
   })

   const data = await connectionRequest.save()

   res.json({
    message: 
    req.user.firstName +  " is " +  status+ " in " + toUser.firstName ,
    data,
   })
 }catch(err){
  res.status(400).send("ERROR:" + err.message)
 }
  })


 

requestsRouter.post("/request/review/:status/:requestId", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    // 1. Validate status
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type: " + status });
    }

    // 2. Validate requestId format
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: "Invalid request ID format" });
    }

    // 3. Fetch the connection request
    const connectionRequest = await ConnectionRequest.findById(requestId);

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // 4. Check ownership: user must be the toUser
    if (connectionRequest.toUserId.toString() !== loggedInUser._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to review this request." });
    }

    // 5. Check if current status is 'interested'
    if (connectionRequest.status !== "interested") {
      return res.status(400).json({ message: "Only 'interested' requests can be reviewed" });
    }

    // 6. Update status
    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({
      message: `${req.user.firstName} has ${status} the connection request.`,
      data,
    });
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

  
       
      
  

  


  module.exports = requestsRouter;
