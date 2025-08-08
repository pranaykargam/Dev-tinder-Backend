const jwt = require("jsonwebtoken");
const User = require("../models/user");


const UserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
     return res.status(401).send("please Login!!!");
    }
    console.log()

    const decodedObj = jwt.verify(token, "DEV@tinder7680");
    const { _id } = decodedObj;

    const user = await User.findById(_id); // ✅ FIXED HERE
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user; // optional: attach user for downstream use
    next();
  } catch (err) {
    res.status(401).send("Unauthorized: " + err.message);
  }
};




module.exports = {
  UserAuth, // ✅ Only exporting what's defined
};

// module.exports = {
//   UserAuth, // ✅ Only exporting what's defined
// };

// module.exports = {
//   UserAuth, // ✅ Only exporting what's defined
// };
