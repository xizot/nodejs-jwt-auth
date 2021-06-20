const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("./../model/User");

const { loginValidation, registerValidation } = require("../validation");
const { verifyRefreshToken, verifyAccessToken } = require("./verifyToken");
const {
    GenerateRefreshToken,
    hashPassword,
    verifyPasswod,
} = require("../helper");
router.post("/login", async (req, res) => {
    const { error } = loginValidation(req.body);
    console.log(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    const userExist = await User.getUserByUsername(req.body.username);

    if (!userExist) {
        res.status(400).json({ error: "Username is not found!" });
        return;
    }

    const passwordIsValid = await verifyPasswod(
        req.body.password,
        userExist.password
    );

    if (!passwordIsValid) {
        res.status(400).json({ error: "Invalid password!" });
        return;
    }

    const accessToken = jwt.sign(
        {
            __id: userExist.userId,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_TIME }
    );

    const refreshToken = await GenerateRefreshToken(userExist.userId);

    res.json({
        accessToken,
        refreshToken,
    });
});
router.post("/register", async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    const { username, fullname, password } = req.body;

    const userExist = await User.getUserByUsername(username);

    if (userExist) {
        res.status(400).json({ error: "Username is already taken" });
        return;
    }

    try {
        const hashedPassword = await hashPassword(password);
        await User.createUser({
            fullname,
            username,
            password: hashedPassword,
        });

        res.json({ message: "Register successfully", username });
    } catch (err) {
        res.status(400).json({ error: "Something went wrong!" });
    }
});
router.post("/refresh-token", verifyRefreshToken, async (req, res) => {
    const accessToken = jwt.sign(
        {
            __id: req.user.__id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_TIME }
    );
    const refreshToken = await GenerateRefreshToken(req.user.__id);

    res.json({
        accessToken,
        refreshToken,
    });
});
router.post("/verify-token", verifyAccessToken, async (req, res) => {
    res.json({ message: "Token is valid" });
});

router.get("/logout", verifyAccessToken, async (req, res) => {
    const userId = req.user.__id;
    await User.updateRefreshToken(userId, "");
    res.json({
        message: "Log out successfully",
    });
});
module.exports = router;
