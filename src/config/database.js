// config/database.js
const mongoose = require("mongoose");


const connectDB = async () => {
  await mongoose.connect(

"mongodb+srv://pranaykargam:DM6cyfU0oPrGx1uR@cluster0.lnfmdob.mongodb.net/"
  )

};

// DM6cyfU0oPrGx1uR

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





