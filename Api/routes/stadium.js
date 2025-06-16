const router = require("express").Router();
const auth = require("../middleware/auth");
const conn = require("../config/database");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
    conn.execute("SELECT * FROM stadium ORDER BY stadium_id DESC", [], function(err, result, fields) {
        if (err) {
            res.status(500).json({
                status: "error",
                message: `Server error : ${err}`,
            });
            return;
        }

        // เพิ่ม type: "stadium" ให้กับแต่ละรายการ
        const modifiedResult = result.map(item => ({
            ...item,
            type: "stadium"
        }));

        res.status(200).json({ status: "ok", data: modifiedResult });
    });
});


router.get("/:id", (req, res) => {
    const { id } = req.params;
    conn.execute("SELECT * FROM stadium WHERE stadium_id = ?", [id], function(err, result, fields) {
        if (err) {
            res.status(500).json({
                status: "error",
                message: `Server error : ${err}`,
            });
            return;
        }

        if (result.length < 1) {
            res.status(400).json({
                status: "error",
                message: "ไม่พบข้อมูล",
            });
            return;
        }

        res.status(200).json({ status: "ok", data: result[0] });
    })
})

router.post("/add", auth, upload.single("img"), (req, res) => {
    conn.execute(
        "SELECT COUNT(*) as count FROM stadium WHERE name = ?",
        [req.body.name],
        function (err, results, fields) {
            if (err) {
                res.status(500).json({
                    status: "error",
                    message: `Server error : ${err}`,
                });
                return;
            }
            if (results[0].count != 0) {
                res.status(400).json({
                    status: "error",
                    message: "มีพื้นที่กีฬานี้แล้ว",
                });
                return;
            }

            conn.execute(
                "INSERT INTO stadium (name, img, status) VALUES (?, ?, ?)",
                [
                    req.body.name, 
                    req.file ? req.file.filename : "",
                    true
                ],
                function (err, results, fields) {
                    if (err) {
                        res.status(400).json({
                            status: "error",
                            message: err,
                        });
                        return;
                    }
                    res.status(200).json({ status: "ok", message: "เพิ่มพื้นที่กีฬาสำเร็จ" });
                }
            );
        }
    );
});

router.put("/edit/:id", auth, upload.single("img"), (req, res) => {
    let stmt = "UPDATE stadium SET name = ? WHERE stadium_id = ?"
    let execute = [req.body.name, req.params.id]

    if (req.file) {
        stmt = "UPDATE stadium SET name = ?, img = ? WHERE stadium_id = ?"
        execute = [req.body.name, req.file ? req.file.filename : "", req.params.id]
    }

    conn.execute(
        stmt,
        execute,
        function (err, results, fields) {
            if (err) {
                res.status(400).json({
                    status: "error",
                    message: err,
                });
                return;
            }
            res.status(200).json({ status: "ok", message: "แก้ไขที่กีฬาสำเร็จ" });
        }
    );
});

router.put("/enable/:id", auth, (req, res) => {
    conn.execute(
        "UPDATE stadium SET status = ? WHERE stadium_id = ?",
        [true, req.params.id],
        function (err, results, fields) {
            if (err) {
                res.status(400).json({
                    status: "error",
                    message: err,
                });
                return;
            }
            res.status(200).json({ status: "ok", message: "เปิดใช้งานพื้นที่กีฬาสำเร็จ" });
        }
    );
});

router.put("/disable/:id", auth, (req, res) => {
    conn.execute(
        "UPDATE stadium SET status = ? WHERE stadium_id = ?",
        [false, req.params.id],
        function (err, results, fields) {
            if (err) {
                res.status(400).json({
                    status: "error",
                    message: err,
                });
                return;
            }
            res.status(200).json({ status: "ok", message: "ยกเลิการใช้งานพื้นที่กีฬาสำเร็จ" });
        }
    );
});

module.exports = router;
