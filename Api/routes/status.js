const router = require("express").Router();
const auth = require("../middleware/auth");
const conn = require("../config/database");

router.get("/", auth, async (req, res) => {
    try {
        let responseData = [];

        // ดึงข้อมูลจาก borrowingdocuments (type = sport)
        const [resultsSport] = await conn.promise().execute(
            "SELECT * FROM borrowingdocuments WHERE email = ?",
            [req.auth.email]
        );

        for (const data of resultsSport) {
            const [details] = await conn.promise().execute(
                "SELECT bd.*, eq.name FROM borrowingdetails AS bd LEFT JOIN equipment AS eq ON bd.sport_id = eq.sport_id WHERE document_id = ?",
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
                end: end,
                type: "sport" // ✅ เพิ่ม type
            });
        }

        // ดึงข้อมูลจาก stadiumdocuments (type = stadium)
        const [resultsStadium] = await conn.promise().execute(
            "SELECT * FROM stadiumdocuments WHERE email = ?",
            [req.auth.email]
        );

        for (const data of resultsStadium) {
            const [details] = await conn.promise().execute(
                "SELECT sr.reserve_date AS borrow_date, sr.reserve_end AS return_date, sd.name FROM stadiumreservationdetail AS sr LEFT JOIN stadium AS sd ON sr.stadium_id = sd.stadium_id WHERE sdocument_id = ?",
                [data.sdocument_id]
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
                end: end,
                type: "stadium" // ✅ เพิ่ม type
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

router.put("/stadium/:id", auth, (req, res) => {
    conn.execute(
        "DELETE FROM stadiumdocuments WHERE sdocument_id = ?",
        [req.params.id],
        function (err, results, fields) {
            if (err) {
                res.status(400).json({
                    status: "error",
                    message: err,
                });
                return;
            }
            res.status(200).json({ status: "ok", message: "ยกเลิกสำเร็จ" });
        }
    );
});

router.put("/sport/:id", auth, (req, res) => {
    conn.execute(
        "DELETE FROM borrowingdocuments WHERE document_id = ?",
        [req.params.id],
        function (err, results, fields) {
            if (err) {
                res.status(400).json({
                    status: "error",
                    message: err,
                });
                return;
            }
            res.status(200).json({ status: "ok", message: "ยกเลิกสำเร็จ" });
        }
    );
});

module.exports = router;
