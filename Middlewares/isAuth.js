const jwt = require("jsonwebtoken");
const { User } = require("../Models");

exports.isAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            const error = new Error("Not Authenticated");
            error.status = 401;
            throw error;
        }

        const token = authorization.split(' ')[1];
        if (!token) {
            const error = new Error("Not Authenticated");
            error.status = 401;
            throw error;
        }
        const payload = jwt.verify(token, process.env.SECRET_KEY)

        const user = await User.findById(payload.id)
        if (!user) {
            const error = new Error("Not Authenticated");
            error.status = 401;
            throw error;
        }
        req.user = user;
        next();
    } catch (error) {
        next(error)
    }
}