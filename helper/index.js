const { listRefreshToken } = require("../routes/verifyToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const GenerateRefreshToken = async (userId) => {
    const refreshToken = jwt.sign(
        {
            __id: userId,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_TIME,
        }
    );
    await User.updateRefreshToken(userId, refreshToken);
    return refreshToken;
};

const verifyPasswod = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};
module.exports = { GenerateRefreshToken, hashPassword, verifyPasswod };
