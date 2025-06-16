const router = require("express").Router();
const auth = require("../middleware/auth");
const conn = require("../config/database");

router.get("/:roles", async (req, res) => {
    const roles = req.params.roles;

    try {
        let waitQuery, approveQuery, cancelQuery;

        if (roles === "Sports") {
            waitQuery = conn.promise().execute(
                "SELECT count(sdocument_id) AS count FROM stadiumdocuments WHERE status = ?", ["wait"]
            );
            approveQuery = conn.promise().execute(
                "SELECT count(sdocument_id) AS count FROM stadiumdocuments WHERE status = ?", ["approve"]
            );
            cancelQuery = conn.promise().execute(
                "SELECT count(sdocument_id) AS count FROM stadiumdocuments WHERE status = ?", ["cancel"]
            );
        } else {
            waitQuery = conn.promise().execute(
                "SELECT count(document_id) AS count FROM borrowingdocuments WHERE status = ?", ["wait"]
            );
            approveQuery = conn.promise().execute(
                "SELECT count(document_id) AS count FROM borrowingdocuments WHERE status = ?", ["approve"]
            );
            cancelQuery = conn.promise().execute(
                "SELECT count(document_id) AS count FROM borrowingdocuments WHERE status = ?", ["cancel"]
            );
        }

        const [waitResult, approveResult, cancelResult] = await Promise.all([
            waitQuery, approveQuery, cancelQuery
        ]);

        const responseData = {
            wait: waitResult[0][0].count,
            approve: approveResult[0][0].count,
            cancel: cancelResult[0][0].count
        };

        res.status(200).json({ status: "ok", data: responseData });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: `Server error : ${err}`,
        });
    }
});

module.exports = router;
