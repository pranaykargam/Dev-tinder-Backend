const mongoose = require("mongoose");
const { GrValidate } = require("react-icons/gr");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt  = require("bcrypt")

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required:true,
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

  photourl:{
    type:String,
    default:"https://www.vecteezy.com/vector-art/11401535-online-shopping-trolley-click-and-collect-order-vector-logo-design-templatehttps://in.pinterest.com/pin/47287864831917357/",
    validate(value){
      if(!validator.isURL(value)){
        throw new Error("Invalid photo address")
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
  }
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
