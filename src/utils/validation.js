const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName,lastName,emailId,password,skills} = req.body;

if(!firstName || !lastName){
    throw new Error("Name is not valid!!");
}
else if(!validator.isEmail(emailId)){
    throw new Error("Email is not Valid!!!")
}else if(!validator.isStrongPassword(password)){
    throw new Error("please enter a strong password!!")
}

if (skills && skills.length > 30) {
    throw new Error("More than 30 skills are not allowed");
  }
}

const validateEditProfileData = (req)=> {
    const allowedEditFields = [
       "firstName",
       "lastName",
       "age",
       "emailId",
       "photoUrl",
       "gender",
       "about",
       "skills",

]
  const isEditAllowed = Object.keys(req.body).every((field)=>{
    return allowedEditFields.includes(field)
  })
  return isEditAllowed
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
  };
  