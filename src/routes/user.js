//  userRouter
// - GET /user/requests
// - GET /user/connections
// - GET /user /feed - Gets you the profiles of other users on platform


const express = require("express");
const { UserAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age skills about status";
const User = require("../models/user");

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
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" }
        ]
       
      }).populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
      console.log(connectionRequests)
      const data = connectionRequests.map ((row)=> {
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId;
        }
            return row.fromUserId;
        
      }) 
        res.json({data}); 
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

// userRouter.get("/user/connections",UserAuth,async(req,res)=>{
//   try{
//     const loggedInUser = req.user;
//     const connectionRequests = await ConnectionRequest.find({
//       $or: [
//         { fromUserId: loggedInUser._id, status: "accepted" },
//         { toUserId: loggedInUser._id, status: "accepted" }
//       ]
     
//     }).populate("fromUserId", USER_SAFE_DATA)
//     .populate("toUserId", USER_SAFE_DATA);
//     console.log(connectionRequests)
//     const data = connectionRequests.map ((row)=> {
//       if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
//           return row.toUserId;
//       }
//           return row.fromUserId;
      
//     }) 
//       res.json({data}); 
//   }catch(err){
//       res.status(400).send("ERROR: " + err.message);
//   }
// })



userRouter.get("/user/feed", UserAuth, async (req, res) => {
 

    try{
      // User should see all the the user cards except
      //  01. his own card
      // 02.his connections
       // 03.already sent connection requests which are accepted
      // 04.ignored connections

      const loggedInUser = req.user;
      const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
      let limit = parseInt(req.query.limit) || 10;
      limit = limit >50 ? 50:limit; // Limit the maximum number of items per page to 50
      const skip = (page - 1) * limit; // Calculate the number of items to skip

      // Find all connection requests (sent + received) related to the logged-in user
      const connectionRequests = await ConnectionRequest.find({
        $or: [ { fromUserId: loggedInUser._id },{ toUserId: loggedInUser._id } ]
      }).select("fromUserId toUserId ");
     
      const hideUserfromFeed = new Set();
      connectionRequests.forEach((req) => {
        hideUserfromFeed.add(req.fromUserId.toString());
        hideUserfromFeed.add(req.toUserId.toString());
      });
     

      const users = await User.find({
        $and:[
          {_id: { $nin: Array.from(hideUserfromFeed) } }, // except users in hideUserfromFeed
          {_id: { $ne: loggedInUser._id } } // own card
        ]
      }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    

      res.send(users)
    
    }catch(err){
      console.log("Error in /user/feed route:", err);
        res.status(400).json({message: err.message});
    }
})






module.exports = userRouter;

