const jwt = require("jsonwebtoken");
const HttpError = require("../Modals/errorModal");

const authentificationMiddleware = async (req, res, next) => {
    const authoriazation = req.headers.Authorization || req.headers.authorization
    if(authoriazation && authoriazation.startsWith("Bearer")){
        const token = authoriazation.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) return next(new HttpError("token could not be verified", 422))
            req.user = decoded; //that token contains id and name
            next()
        })
    }
    else return next(new HttpError("Unauthorized token", 422))
}
module.exports = authentificationMiddleware
