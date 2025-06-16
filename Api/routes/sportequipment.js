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
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const query = `
        SELECT 
            e.sport_id,
            e.name,
            e.sport_id,
            e.quantity,
            e.status,
            e.img,
            IFNULL(SUM(CASE 
                WHEN bd.return_date > ? AND (bdoc.status NOT IN ('cancel', 'success', 'wait', 'approve')) THEN bd.quantity
                ELSE 0 
            END), 0) AS borrowed_quantity
        FROM equipment e
        LEFT JOIN borrowingdetails bd ON e.sport_id = bd.sport_id
        LEFT JOIN borrowingdocuments bdoc ON bd.document_id = bdoc.document_id
        GROUP BY e.sport_id
        ORDER BY e.sport_id DESC
    `;

    conn.execute(query, [now], function(err, result, fields) {
        if (err) {
            res.status(500).json({
                status: "error",
                message: `Server error : ${err}`,
            });
            return;
        }

        const modifiedResult = result.map(item => ({
            equipment_id: item.equipment_id,
            name: item.name,
            sport_id: item.sport_id,
            quantity: item.quantity,
            available: item.quantity - item.borrowed_quantity,
            img: item.img,
            type: "sport",
            status: item.status
        }));

        res.status(200).json({ 
            status: "ok", 
            data: modifiedResult 
        });
    });
});

router.get("/reduce", (req, res) => {
    conn.execute("SELECT re.date, re.amount, re.note, e.name, u.email AS admin FROM reduceequipment AS re LEFT JOIN user AS u ON re.user_id = u.user_id LEFT JOIN equipment AS e ON e.sport_id = re.sport_id ORDER BY re.date DESC", [], function(err, result, fields) {
        if (err) {
            res.status(500).json({
                status: "error",
                message: `Server error : ${err}`,
            });
            return;
        }

        res.status(200).json({ status: "ok", data: result });
    });
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    conn.execute("SELECT * FROM equipment WHERE sport_id = ?", [id], function(err, result, fields) {
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
        "SELECT COUNT(*) as count FROM equipment WHERE name = ?",
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
                    message: "มีอุปกรณ์กีฬานี้แล้ว",
                });
                return;
            }

            conn.execute(
                "INSERT INTO equipment (name, quantity, img, status) VALUES (?, ?, ?, ?)",
                [
                    req.body.name, 
                    req.body.quantity,
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
                    res.status(200).json({ status: "ok", message: "เพิ่มอุปกรณ์กีฬาสำเร็จ" });
                }
            );
        }
    );
});

router.put("/edit/:id", auth, upload.single("img"), (req, res) => {
    let stmt = "UPDATE equipment SET name = ?, quantity = ? WHERE sport_id = ?"
    let execute = [req.body.name, req.body.quantity, req.params.id]

    if (req.file) {
        stmt = "UPDATE equipment SET name = ?, quantity = ?, img = ? WHERE sport_id = ?"
        execute = [req.body.name, req.body.quantity, req.file ? req.file.filename : "", req.params.id]
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
            res.status(200).json({ status: "ok", message: "แก้ไขอุปกรณ์กีฬาสำเร็จ" });
        }
    );
});

router.put("/reduce/:id", auth, (req, res) => {
    conn.execute(
        "SELECT quantity FROM equipment WHERE sport_id = ?",
        [req.params.id],
        function (err, results, fields) {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: `Server error : ${err}`,
                });
            }

            if (results.length < 1) {
                return res.status(400).json({
                    status: "error",
                    message: "ไม่พบข้อมูล",
                });
            }

            if (results[0].quantity >= req.body.amount) {
                const newQuantity = results[0].quantity - req.body.amount;

                conn.execute(
                    "UPDATE equipment SET quantity = ? WHERE sport_id = ?",
                    [newQuantity, req.params.id],
                    function (err, results, fields) {
                        if (err) {
                            return res.status(500).json({
                                status: "error",
                                message: `Server error : ${err}`,
                            });
                        }

                        conn.execute(
                            `INSERT INTO reduceequipment (amount, note, sport_id, user_id) 
                             VALUES (?, ?, ?, (SELECT user_id FROM user WHERE email = ?))`,
                            [req.body.amount, req.body.note, req.params.id, req.auth.email],
                            function (err, results, fields) {
                                if (err) {
                                    return res.status(500).json({
                                        status: "error",
                                        message: `Server error : ${err}`,
                                    });
                                }

                                return res.status(200).json({
                                    status: "ok",
                                    message: "จำหน่ายอุปกรณ์สำเร็จ",
                                });
                            }
                        );
                    }
                );
            } else {
                return res.status(200).json({
                    status: "error",
                    message: "จำนวนอุปกรณ์มีน้อยกว่าที่จะจำหน่าย",
                });
            }
        }
    );
});

router.put("/enable/:id", auth, (req, res) => {
    conn.execute(
        "UPDATE equipment SET status = ? WHERE sport_id = ?",
        [true, req.params.id],
        function (err, results, fields) {
            if (err) {
                res.status(400).json({
                    status: "error",
                    message: err,
                });
                return;
            }
            res.status(200).json({ status: "ok", message: "เปิดใช้งานอุปกรณ์กีฬาสำเร็จ" });
        }
    );
});

router.put("/disable/:id", auth, (req, res) => {
    conn.execute(
        "UPDATE equipment SET status = ? WHERE sport_id = ?",
        [false, req.params.id],
        function (err, results, fields) {
            if (err) {
                res.status(400).json({
                    status: "error",
                    message: err,
                });
                return;
            }
            res.status(200).json({ status: "ok", message: "ยกเลิการใช้งานอุปกรณ์กีฬาสำเร็จ" });
        }
    );
});

module.exports = router;
