import userModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const fullname = req.body.fullname;

        // is required fields
        if (!username) return res.status(428).json({ code: 428, msg: "USERNAME_IS_REQUIRED" });
        if (!password) return res.status(428).json({ code: 428, msg: "PASSWORD_IS_REQUIRED" });
        if (!fullname) return res.status(428).json({ code: 428, msg: "FULLNAME_IS_REQUIRED" });

        // check if username already exist
        const isExist = await userModel.findOne({
            where: {
                username: username,
            },
        });
        
        if (isExist) {
            return res.status(409).json({
                code: 409,
                status: false,
                msg: "USERNAME_ALREADY_EXIST",
            });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            username: username,
            password: hashedPassword,
            fullname: fullname,
        });

        // show user
        const showData = {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }

        res.status(201).json({
            code: 201,
            status: true,
            msg: "USER_REGISTERED_SUCCESSFULLY",
            data: showData,
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: false,
            msg: error.msg,
        });
    }
};

const login = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        // is required fields
        if (!username) return res.status(428).json({ code: 428, msg: "USERNAME_IS_REQUIRED" });
        if (!password) return res.status(428).json({ code: 428, msg: "PASSWORD_IS_REQUIRED" });

        // check if username exist
        const isExist = await userModel.findOne({
            where: {
                username: username,
            },
        });
        if (!isExist) {
            return res.status(404).json({
                code: 404,
                status: false,
                msg: "USER_NOT_FOUND",
            });
        }

        // check if password match
        const isMatch = await bcrypt.compare(password, isExist.password);
        if (!isMatch) {
            return res.status(403).json({
                code: 403,
                status: false,
                msg: "PASSWORD_NOT_MATCH",
            });
        }

        const showData = {
            id: isExist.id,
            username: isExist.username,
            fullname: isExist.fullname,
        }

        res.status(200).json({
            code: 200,
            status: true,
            msg: "USER_LOGGED_IN_SUCCESSFULLY",
            data: showData,
        });
    } catch (error) {
        res.status(500).send({
            code: 500,
            status: false,
            msg: "FAILED_TO_LOGIN_USER",
        });
    }
}

export { register, login }