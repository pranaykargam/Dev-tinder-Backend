const express = require("express");
const profileRouter = express.Router();
const {UserAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation")
const bcrypt = require("bcrypt");
const User = require("../models/user");

profileRouter.get("/profile/view",UserAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (err) {
      // console.error("Profile error:", err.message);
      res.status(401).send("Error: " + err.message);
    }
  });

  profileRouter.patch("/profile/edit",UserAuth, async (req, res) => {
try{
    if(!validateEditProfileData(req)){
        throw new Error ("Invalid data provided for profile update")
    }

const loggedInUser = req.user;
console.log(loggedInUser)

Object.keys(req.body).forEach((key) => {
    loggedInUser[key] = req.body[key];
  });
console.log("LoggedInUser")
    await loggedInUser.save()

res.send(`${loggedInUser.firstName}, your profile updated successfully!!`)
  }catch(err){
    return res.status(400).send("ERROR")
}})



profileRouter.patch("/profile/password-forgot", async (req, res) => {
  try {
    const { emailId, newPassword } = req.body;

    if (!emailId || !newPassword) {
      return res.status(400).send("Email and new password are required!!!");
    }

    // Check if user exists
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Validate password strength (optional but recommended)
    if (newPassword.length < 6) {
      return res.status(400).send("Password must be at least 6 characters");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.send("Password updated successfully!");
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).send("Server error: " + err.message);
  }
});


module.exports = profileRouter