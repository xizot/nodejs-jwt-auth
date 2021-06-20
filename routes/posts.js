const { verifyAccessToken } = require("./verifyToken");
const router = require("express").Router();

router.get("/", verifyAccessToken, (req, res) => {
    res.json({
        posts: {
            title: "my first book",
            description: "random data you shouldnt access",
        },
    });
});

module.exports = router;
