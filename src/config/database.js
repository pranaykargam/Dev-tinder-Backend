// config/database.js
const mongoose = require("mongoose");


const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sunnykargam1:Lalitha%409912@cluster0.lnfmdob.mongodb.net/devTinder"
  );
  
};

connectDB()
  .then(() => {
   
      console.log("data base is connectd");
  // app.listen(3000,()=>{
  //   console.log("server is listening on port 3000");
  // }) 
})
  .catch((err) => {
    console.error("Database connection failed", );
  });





