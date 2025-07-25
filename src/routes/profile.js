const express = require("express");
const profileRouter = express.Router();
const {UserAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation")

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

Object.keys(req,body).forEach((key) => (loggedInUser[key] = req.body[key]))
console.log("LoggedInUser")
    await loggedInUser.save()

res.send(`${loggedInUser.firstName}, your profile updated successfully!!`)
  }catch(err){
    return res.status(400).send("ERROR")
}})

module.exports = profileRouter