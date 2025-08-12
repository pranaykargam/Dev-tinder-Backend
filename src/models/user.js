const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt  = require("bcrypt")

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    
    required:true,
     // reference to the user collection
    minLength:4,
    maxLength:40
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    lowercase:true,
    required: true,
    unique: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid email address")
      }
    }
  },
  
  password: {
    type: String,
    required:true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("use some strong password!!!!!")
      }
    }
    
    
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum:{
      values: ["male","female","others"],
      message: `{VALUE} is  not valid gender type`

    },
  },
  //   validate(value){
  //     if(!["male","female","others"].includes(value)){
  //       throw new Error("gender is not valid")
  //     }
  //   }
  // },


  photouUrl: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid photo address");
      }
    }
  },
  
 
  about:{ 
    type:String,
    default:"this is the default about of the user"
  },
  skills: {
    type: [String],
    validate: [
      function (value) {
        return value.length <= 30;
      },
      "Maximum 30 skills allowed"
    ]
  },

  // connections: {
  //   type: [mongoose.Schema.Types.ObjectId],
  //   ref: "User",
  //   default: []
  // }
  
},
{
  timestamps:true,
});



userSchema.methods.getJWT  = async function (){
  const user = this;

  const token = await jwt.sign({_id:user._id},"DEV@tinder7680",{
    expiresIn:"7d",
  });
      return token;
}


userSchema.methods.validatePassword = async function (passwordInputByUser){
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid  = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  )
  return isPasswordValid
}


module.exports = mongoose.model("User", userSchema);



