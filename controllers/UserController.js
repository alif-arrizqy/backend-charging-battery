import userModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

const showUser = async (req, res) => {
    try {
        const id = req.params.id;

        // is required fields
        if (!id) return res.status(428).json({ code: 428, msg: "ID_IS_REQUIRED" });

        // check if id exist
        const isIdExist = await userModel.findOne({
            where: {
                id: id,
            },
        });
        if (!isIdExist) {
            return res.status(404).json({
                code: 404,
                status: false,
                msg: "ID_NOT_FOUND",
            });
        }

        // check if user exist
        const isExist = await userModel.findOne({
            where: {
                id: id,
            },
        });
        if (!isExist) return res.status(404).json({ code: 404, msg: "USER_NOT_FOUND" });

        res.status(200).json({
            code: 200,
            status: true,
            msg: "USER_FOUND",
            data: isExist,
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: false,
            msg: error.message,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const username = req.body.username;
        const fullname = req.body.fullname;
        const password = req.body.password;

        // is required fields
        if (!id) return res.status(428).json({ code: 428, msg: "ID_IS_REQUIRED" });
        if (!username) return res.status(428).json({ code: 428, msg: "USERNAME_IS_REQUIRED" });
        if (!fullname) return res.status(428).json({ code: 428, msg: "FULLNAME_IS_REQUIRED" });

        // check if id exist
        const isIdExist = await userModel.findOne({
            where: {
                id: id,
            },
        });
        if (!isIdExist) {
            return res.status(404).json({
                code: 404,
                status: false,
                msg: "ID_NOT_FOUND",
            });
        }
        
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

        let fields = {};
        fields.username = username;
        fields.fullname = fullname;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            fields.password = hashedPassword;
        }

        // update user by id
        const user = await userModel.update(fields, {
            where: {
                id: id,
            },
        });

        if (!user) {
            return res.status(500).json({
                code: 500,
                status: false,
                msg: "USER_UPDATE_FAILED",
            });
        }

        // show data
        const showData = {
            id: user.id,
            username: username,
            fullname: fullname,
        }

        res.status(200).json({
            code: 200,
            status: true,
            msg: "USER_UPDATE_SUCCESS",
            data: showData,
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: false,
            msg: error.message,
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        
        // is required fields
        if (!id) return res.status(428).json({ code: 428, msg: "ID_IS_REQUIRED" });

        // check if id exist
        const isIdExist = await userModel.findOne({
            where: {
                id: id,
            },
        });
        if (!isIdExist) {
            return res.status(404).json({
                code: 404,
                status: false,
                msg: "ID_NOT_FOUND",
            });
        }

        // delete user
        const user = await userModel.destroy({
            where: {
                id: id,
            },
        });

        if (!user) {
            return res.status(500).json({
                code: 500,
                status: false,
                msg: "USER_DELETE_FAILED",
            });
        }

        res.status(200).json({
            code: 200,
            status: true,
            msg: "USER_DELETE_SUCCESS",
            data: id,
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: false,
            msg: error.message,
        });
    }
};
        

export { updateUser, deleteUser, showUser };