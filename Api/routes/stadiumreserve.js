const router = require("express").Router();
const auth = require("../middleware/auth");
const conn = require("../config/database");

router.get("/", auth, async (req, res) => {
    try {
        const [results] = await conn.promise().execute(
            "SELECT * FROM stadiumdocuments"
        );

        let responseData = [];

        for (const data of results) {
            const [details] = await conn.promise().execute(
                "SELECT sr.*, sd.* FROM stadiumreservationdetail AS sr LEFT JOIN stadium AS sd ON sr.stadium_id = sd.stadium_id WHERE sdocument_id = ?",
                [data.sdocument_id]
            );

            // ค้นหา borrow_date ที่เริ่มก่อนและ return_date ที่หลังสุด
            let start = details.length > 0 ? details[0].reserve_date : null;
            let end = details.length > 0 ? details[0].reserve_end : null;
            for (const detail of details) {
                if (detail.reserve_date < start) start = detail.reserve_date;
                if (detail.reserve_end > end) end = detail.reserve_end;
            }

            responseData.push({
                ...data,
                items: details,
                start: start,
                end: end
            });
        }

        res.status(200).json({ status: "ok", data: responseData });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: ${err.message}`
        });
    }
});

router.put("/approve/:id", auth, (req, res) => {
    conn.execute(
        "UPDATE stadiumdocuments SET status = ? WHERE sdocument_id = ?",
        ["approve", req.params.id],
        function (err, results, fields) {
            if (err) {
                res.status(400).json({
                    status: "error",
                    message: err,
                });
                return;
            }
            res.status(200).json({ status: "ok", message: "อนุมัติเอกสารสำเร็จ" });
        }
    );
});

router.put("/receive/:id", auth, (req, res) => {
    conn.execute(
        "UPDATE stadiumdocuments SET status = ? WHERE sdocument_id = ?",
        ["ongoing", req.params.id],
        function (err, results, fields) {
            if (err) {
                res.status(400).json({
                    status: "error",
                    message: err,
                });
                return;
            }
            res.status(200).json({ status: "ok", message: "รับอุปกรณ์สำเร็จ" });
        }
    );
});

router.put("/return/:id", auth, (req, res) => {
    conn.execute(
        "UPDATE stadiumdocuments SET status = ? WHERE sdocument_id = ?",
        ["success", req.params.id],
        function (err, results, fields) {
            if (err) {
                res.status(400).json({
                    status: "error",
                    message: err,
                });
                return;
            }
            res.status(200).json({ status: "ok", message: "รับคืนสำเร็จ" });
        }
    );
});

router.put("/cancel/:id", auth, (req, res) => {
    conn.execute(
        "UPDATE stadiumdocuments SET status = ? WHERE sdocument_id = ?",
        ["cancel", req.params.id],
        function (err, results, fields) {
            if (err) {
                res.status(400).json({
                    status: "error",
                    message: err,
                });
                return;
            }
            res.status(200).json({ status: "ok", message: "รับคืนสำเร็จ" });
        }
    );
});

module.exports = router;
