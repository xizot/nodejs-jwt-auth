const jwt = require("jsonwebtoken");
const User = require("../model/User");

const verifyAccessToken = (req, res, next) => {
    const bearerAccessToken = req.headers.authorization;
    if (!bearerAccessToken) {
        res.status(401).send("Access Denied");
    }
    
    try {
        const token = bearerAccessToken.split(" ")[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Your session is not valid",
            data: error,
        });
    }
};

const verifyRefreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).send("Access Denied");
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        //check refresh token in store

        const existingRefreshToken = await User.getRefreshTokenById(
            decoded.__id
        );
        if (!existingRefreshToken || existingRefreshToken.trim() === "") {
            res.status(401).json({
                message: "Invalid Token. Token is not in store",
                data: error,
            });
        }

        if (existingRefreshToken !== refreshToken) {
            res.status(401).json({
                message: "Invalid Token. Token is not same in store",
                data: error,
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Your session is not valid",
            data: error,
        });
    }
};

module.exports = { verifyAccessToken, verifyRefreshToken };
