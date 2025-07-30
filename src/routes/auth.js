const express = require("express");
const authRouter = express.Router();
const { validateSignUpData} = require("../utils/validation")
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {

    try {
      // Validation of data
      validateSignUpData(req)
      const { firstName, lastName, emailId, password, age, gender,skills } = req.body;
  
      // Encrypt the password
      const passwordHash = await bcrypt.hash(password,10);
      console.log(passwordHash);
  
  
     
  
     
      const existingUser = await User.findOne({ emailId });
      if (existingUser) {
        return res.status(400).send("User already exists");
      }
  
     
      const user = new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash,
        age,
        gender,
        skills,
      });
  
      await user.save();
  
      res.send({
       "message": "User signed up successfully",
       
      });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(400).send("Error saving the user: " + err.message);
    }
  });


authRouter.post("/login", async (req, res) => {

    try {
      const { emailId, password } = req.body;
  
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        throw new Error("invalid email id");
      }
  
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        throw new Error("invalid password");
      }
  // create a JWT token 
  // const token   = await jwt.sign({_id:user._id},"DEV@tinder7680",{
  //   expiresIn:"7d",
  // });
  const token = await user.getJWT();
  console.log("Generated token:", token);
     
  // Add the token to cookie and send the responce back to the user
      // res.cookie("token", "vewckdiuvhagfukyregfyiwegdfiue");
      res.cookie("token",token,{
        expires:new Date(Date.now() + 8 * 3600000), 
      });
      res.send("Login Successfully!!!!!");
  
    } catch (err) {
      console.error("Login error:", err);
      res.status(400).send("Error: " + err.message);
    }
  });

  authRouter.post("/logout",async(req,res)=>{
    res.cookie("token", null,{
        expires:new Date(Date.now()),
    })
    res.send("Logged out successfully!!!!!!")
  })


module.exports = authRouter;