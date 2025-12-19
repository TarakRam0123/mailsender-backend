const jwt = require("jsonwebtoken");
exports.verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    // console.log(token);
    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
        status: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userid = decoded.userid;
    next();
  } catch (err) {
    return res.status(401).json({
      message: err.message,
      status: false,
    });
  }
};
