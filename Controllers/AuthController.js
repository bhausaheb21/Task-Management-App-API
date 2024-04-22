const { validationResult } = require("express-validator");
const { User } = require("../Models");
const { getSalt, encryptPass, getToken } = require("../Services/authUtility");
const bcrypt = require('bcryptjs')
class AuthController {
    static async signup(req, res, next) {
        try {
            const errors = validationResult(req).array();
            if (errors.length > 0) {

                const error = new Error(errors[0].msg)
                error.status = 422;
                throw error;
            }
            const { email, firstName, password, lastName } = req.body;
            const user = await User.findOne({ email: email })

            if (user) {
                const error = new Error("User with email already exist");
                error.status = 422;
                throw error;
            }

            const salt = await getSalt();
            const hashedpassword = await encryptPass(password, salt);
            const newuser = new User({ email, password: hashedpassword, firstName, lastName, salt });
            const saveduser = await newuser.save();

            // login for saved user
            const payload = {
                firstName,
                lastName,
                email,
                id: saveduser.__id

            }
            const token = "Bearer " + getToken(payload)
            return res.status(201).json({ message: "Signup Successful", token, firstName, lastName, email })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            const errors = validationResult(req).array();
            if (errors.length > 0) {

                const error = new Error(errors[0].msg)
                error.status = 422;
                throw error;
            }
            const { email, password } = req.body;
            const user = await User.findOne({ email: email });
            if (!user) {
                const error = new Error("User with email not exist");
                error.status = 422;
                throw error;
            }
            const matched = await bcrypt.compare(password, user.password);

            if (!matched) {
                const error = new Error("Invalid Password");
                error.status = 422;
                throw error;
            }

            const payload = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email
            }

            const token = "Bearer " + getToken(payload);

            return res.status(200).json({ message: "Login Successful", token, firstName: user.firstName, lastName: user.lastName, email });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = AuthController