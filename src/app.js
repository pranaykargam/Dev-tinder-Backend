const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { ReturnDocument } = require("mongodb");
const { validateSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const {UserAuth} = require("./middlewares/auth");

app.use(express.json()); 
app.use(cookieParser()); 


// Route for user signup
app.post("/signup", async (req, res) => {

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
      message: "User added successfully",
      id: user._id,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).send("Error saving the user: " + err.message);
  }
});



app.post("/login", async (req, res) => {

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

// adjust path as needed

app.get("/profile",UserAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    // console.error("Profile error:", err.message);
    res.status(401).send("Error: " + err.message);
  }
});


app.post("/sendConnectionRequest",UserAuth,async(req,res)=>{
  console.log("sending connection request")
  res.send(req.user.firstName +"send the connection request")
})



// Route for fetching user details
app.get("/user", async (req, res) => {
  const userEmail = req.query.emailId;

  try {
    const user = await User.findOne({ emailId:userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong" );
  }
});



app.get("/feed", async (req, res) => {
  const { name } = req.query; // Extract name from query parameters
  try {
    const users = await User.find({ firstName: name }); 
    // Fetch all users matching the name
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.send(users); // Send all matching users
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Update the data :
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "photourl","about","gender","age","skills",
    ];
 
  const isUpdateAllowed = Object.keys(data).every((k) => {
    return ALLOWED_UPDATES.includes(k);
  });
  
  if(!isUpdateAllowed) {
    throw new Error("Update is not allowed")
  }

  if(data?.skills && data.skills.length>30){
    throw new Error("more than 30 skills are not allowed")
  }
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });

    console.log("Updated user:", updatedUser);

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.send("User updated successfully");
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(400).send("Update failed: " + err.message);
  }
});

// Delete the data:
app.delete("/user",async (req,res)=> {
  const userId = req.query.userId;
  console.log("Trying to delete user with ID:", userId);
  try {
    
    const user = await User.findByIdAndDelete( userId );
      res.send("user deleted successfully");
  } 
  catch (err) {
    res.status(500).send("something went wrong" );
  }
})


// Start the server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});


