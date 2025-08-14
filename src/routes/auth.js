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
  
      const savedUser =await user.save();
      const token = await savedUser.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // 8 hours
        httpOnly: true,
      });
  
      res.send({
       "message": "User signed up successfully",data:savedUser });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(400).send("Error saving the user: " + err.message);
    

    }
  });

 
  authRouter.post("/login", async (req, res) => {
    console.log("🔔 Received login request:", req.body);
  
    try {
      const { emailId, password } = req.body;
  
      // Find user using the User model
      const user = await User.findOne({ emailId });
      if (!user) {
        throw new Error("Invalid email id");
      }
  
      // Validate password using instance method
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }
  
      // Generate JWT token
      const token = await user.getJWT();
      console.log("Generated token:", token);
  
      // Set cookie with token
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
      });
  
      // Send response
      res.status(200).send({
        message: "Login successful!",
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          skills: user.skills,
          emailId: user.emailId,
        },
        token,
      });
  
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



