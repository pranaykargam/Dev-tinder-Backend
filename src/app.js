const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");


const app = express()
const cors = require("cors");
// make sure the path matches your project



app.use(
  cors({
    origin: "http://localhost:5173", // Update with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }

  ));
app.use(express.json()); 
app.use(cookieParser()); 


const authRouter = require("./routes/auth")

const profileRouter = require("./routes/profile")

const requestsRouter = require("./routes/request")

const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);




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


//   const userId = req.params?.userId;
//   const data = req.body;

//   try {
//     const ALLOWED_UPDATES = [
//       "photourl","about","gender","age","skills",
//     ];
 
//   const isUpdateAllowed = Object.keys(data).every((k) => {
//     return ALLOWED_UPDATES.includes(k);
//   });
  
//   if(!isUpdateAllowed) {
//     throw new Error("Update is not allowed")
//   }

//   if(data?.skills && data.skills.length>30){
//     throw new Error("more than 30 skills are not allowed")
//   }
//     const updatedUser = await User.findByIdAndUpdate(userId, data, {
//       new: true,
//       runValidators: true,
//     });

//     console.log("Updated user:", updatedUser);

//     if (!updatedUser) {
//       return res.status(404).send("User not found");
//     }

//     res.send("User updated successfully");
//   } catch (err) {
//     console.error("Update error:", err.message);
//     res.status(400).send("Update failed: " + err.message);
//   }
// });

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


//   const userId = req.query.userId;
//   console.log("Trying to delete user with ID:", userId);
//   try {
    
//     const user = await User.findByIdAndDelete( userId );
//       res.send("user deleted successfully");
//   } 
//   catch (err) {
//     res.status(500).send("something went wrong" );
//   }
// })


//   const userId = req.query.userId;
//   console.log("Trying to delete user with ID:", userId);
//   try {
    
//     const user = await User.findByIdAndDelete( userId );
//       res.send("user deleted successfully");
//   } 
//   catch (err) {
//     res.status(500).send("something went wrong" );
//   }
// })






// Start the server
app.listen(3000, '0.0.0.0', () => console.log("Server running on port 3000"));

















