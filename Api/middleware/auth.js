const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res
            .status(401)
            .json({ status: "error", message: "Required token" });
    }

    jwt.verify(
        token.split(" ")[1],
        process.env.SECERT_KET,
        function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    status: "error",
                    message: `${err.name} : ${err.message}`,
                });
            }
            req.auth = decoded;
            return next();
        }
    );
};

module.exports = verifyToken;
