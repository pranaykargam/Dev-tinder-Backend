
const express = require("express");
const requestsRouter = express.Router();
const {UserAuth} = require("../middlewares/auth");


requestsRouter.post("/sendConnectionRequest",UserAuth,async(req,res)=>{
    console.log("sending connection request")
    res.send(req.user.firstName +"send the connection request")
  })


  module.exports = requestsRouter;
