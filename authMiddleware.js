const jwt = require("jsonwebtoken")
const User = require("./model/userModel")


const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // get token from header 
            token = req.headers.authorization.split(" ")[1];

            // verify token 
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // get user from token and attach to the request 
            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(401).json({
                message: "Not authorized, token failed"
            })
        }

        if(!token) {
            res.status(401).json({
                message: "Not authorized, no token"
            })
        }


    }
}

module.exports = protect;



