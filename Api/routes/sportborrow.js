const router = require("express").Router();
const auth = require("../middleware/auth");
const conn = require("../config/database");

router.get("/", auth, async (req, res) => {
    try {
        const [results] = await conn.promise().execute(
            "SELECT * FROM borrowingdocuments"
        );

        let responseData = [];

        for (const data of results) {
            const [details] = await conn.promise().execute(
                "SELECT eq.*, bd.*, bd.quantity AS count FROM borrowingdetails AS bd LEFT JOIN equipment AS eq ON bd.sport_id = eq.sport_id WHERE document_id = ?",
                [data.document_id]
            );

            // ค้นหา borrow_date ที่เริ่มก่อนและ return_date ที่หลังสุด
            let start = details.length > 0 ? details[0].borrow_date : null;
            let end = details.length > 0 ? details[0].return_date : null;
            for (const detail of details) {
                if (detail.borrow_date < start) start = detail.borrow_date;
                if (detail.return_date > end) end = detail.return_date;
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
        "UPDATE borrowingdocuments SET status = ? WHERE document_id = ?",
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
        "UPDATE borrowingdocuments SET status = ? WHERE document_id = ?",
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
        "UPDATE borrowingdocuments SET status = ? WHERE document_id = ?",
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
        "UPDATE borrowingdocuments SET status = ? WHERE document_id = ?",
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
