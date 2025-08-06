const jwt = require("jsonwebtoken");
const User = require("../models/user");




const UserAuth = (req, res, next) => {
  const token = req.cookies.token; // ✅ read from cookies

  if (!token) {
    return res.status(401).send("Unauthorized: No token found in cookies");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized: Token is not valid!");
  }
};

module.exports = UserAuth;


module.exports = {
  UserAuth, // ✅ Only exporting what's defined
};
